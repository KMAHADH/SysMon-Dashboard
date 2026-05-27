import subprocess
import platform
from flask import Flask, jsonify, render_template
import psutil

# Conditional import so it doesn't crash if tested on other platforms
if platform.system() == "Windows":
    import wmi
else:
    wmi = None

app = Flask(__name__)

# --- CONFIGURATION: Windows PowerShell Command Matrix ---
CUSTOM_COMMANDS = {
    "cmd_1": "powershell -Command \"Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 4 -Property Id, ProcessName | Out-String\"",
    "cmd_2": "powershell -Command \"Get-NetTCPConnection -State Listen | Select-Object -First 4 -Property LocalAddress, LocalPort | Out-String\"",
    "cmd_3": "powershell -Command \"Get-CimInstance Win32_LogicalDisk | Where-Object DeviceID -eq 'C:' | ForEach-Object { 'C: Free Space -> ' + [math]::Round($_.FreeSpace / 1GB, 2) + ' GB' }\""
}

def get_windows_thermals():
    """Scrapes motherboard thermal indicators using administrative WMI structures."""
    try:
        if wmi:
            w = wmi.WMI(namespace="root\\WMI")
            # Returns temperature in tenths of a Kelvin
            raw_temp = w.MSAcpi_ThermalZoneTemperature()[0].CurrentTemperature
            celsius = (raw_temp / 10.0) - 273.15
            return round(celsius, 1)
    except Exception:
        # Fallback to absolute CPU utilization load if WMI permissions are restricted
        return psutil.cpu_percent()
    return 0

def check_windows_service(service_name):
    """Audits active system deployment statuses via psutil."""
    try:
        service = psutil.win_service_get(service_name)
        status = service.status()
        return "running" if status == "running" else "stopped"
    except Exception:
        return "missing"

def get_winget_updates():
    """Queries total deployment updates waiting inside Windows Package Manager."""
    try:
        # Runs winget upgrade tool silently to count available updates
        output = subprocess.check_output("winget upgrade", shell=True, text=True)
        lines = output.strip().split('\n')
        # Winget outputs structural tables; lines - 2 gives an approximate upgrade tally
        pending = max(0, len(lines) - 3) 
        return {"installed": "N/A", "pending": pending}
    except Exception:
        return {"installed": "N/A", "pending": 0}

def execute_console_command(cmd_string):
    """Safely encapsulates windows shell execution parameters."""
    try:
        output = subprocess.check_output(cmd_string, shell=True, text=True, stderr=subprocess.STDOUT)
        return output
    except Exception as e:
        return f"Execution Error: {str(e)}"

# --- ROUTES ---
@app.route('/')
def index():
    # Renders your EXISTING frontend index.html template seamlessly
    return render_template('index.html')

@app.route('/api/stats')
def api_stats():
    """Feeds your unchanged frontend Javascript file the identical JSON layout format."""
    payload = {
        "cpu_usage": psutil.cpu_percent(),
        "ram_usage": psutil.virtual_memory().percent,
        "thermal": get_windows_thermals(),
        "services": {
            # Maps Windows Core equivalents: WinRM (Remote Management), Windows Firewall, Windows Update
            "service_1": check_windows_service("WinRM"),
            "service_2": check_windows_service("mpssvc"),
            "service_3": check_windows_service("wuauserv")
        },
        "packages": get_winget_updates(),
        "cmd_1_out": execute_console_command(CUSTOM_COMMANDS["cmd_1"]),
        "cmd_2_out": execute_console_command(CUSTOM_COMMANDS["cmd_2"]),
        "cmd_3_out": execute_console_command(CUSTOM_COMMANDS["cmd_3"])
    }
    return jsonify(payload)

if __name__ == '__main__':
    # Run server locally
    app.run(host='0.0.0.0', port=5000, debug=True)
