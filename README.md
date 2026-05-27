# 📊 SysMon-Dashboard (System Monitor & Console)

> A lightweight real-time Corss-Platform (Windows & Linux) telemetry dashboard built with **Python (Flask)** and **asynchronous JavaScript**.

SysMon provides live system monitoring for:
- **CPU utilization**
- **memory allocation**
- **disk usage**
- **thermal sensors**
- **systemd services**
- **package manager statistics**
- **multi-terminal diagnostics**

Designed as a professional **Corss Platform (Windows & Linux) systems administration** and **infrastructure monitoring** portfolio project.

---

# 🚀 Features

## 📈 Real-Time System Telemetry

Monitor critical Windows & Linux system metrics directly from the browser:

- **CPU utilization**
- **RAM allocation**
- **swap usage**
- **root storage capacity**
- **system load averages**
- **system entropy availability**

---

## 🌡️ Hardware Thermal Monitoring

Reads live hardware thermal data from native Windows & Linux thermal interfaces:

```bash
/sys/class/thermal/thermal_zone0/
```

Windows Management Instrumentation (WMI)


### ✅ Built-In Fallback Handling
If in Linux thermal interfaces are unavailable (common in:
- virtual machines
- cloud instances
- headless environments

), SysMon automatically falls back to CPU sensor telemetry using `psutil`.

---

## ⚙️ systemd Service Auditing

Track active service states for critical Windows  Linux infrastructure daemons including:

Linux: 
| Service | Purpose |
|---|---|
| `sshd` | Secure remote access |
| `cron` | Scheduled task execution |
| `ufw` | Firewall management |
| `networking` | Network interface services |

---

## 📦 Multi-Package Manager Tracking

Aggregates installed package counts and pending updates from:

- **APT**
- **Snap**
- **Flatpak**

Provides a centralized overview of Linux package ecosystems.

---

## 🖥️ Multi-Terminal Bash Workspace

Run multiple live diagnostic commands simultaneously inside the dashboard.

### Example Monitoring Workflows
- memory-heavy process tracking
- active socket monitoring
- disk utilization analysis
- network diagnostics
- process auditing

---

# 🛠️ Technology Stack

## Backend
- **Python 3**
- **Flask**
- **psutil**

## Frontend
- **HTML5**
- **CSS3**
- **Vanilla JavaScript**
- **Async Fetch API**

## Linux Interfaces
- `systemd`
- `procfs`
- `sysfs`
- subprocess execution
- shell utilities

  ## Windows Interfaces
- `WMI`
- `winget`
- `psutil`
- subprocess execution
- powershell utilities

---

# 📋 Installation

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/KMAHADH/SysMon-Dashboard.git
cd SysMon-Dashboard
```

---

## 2️⃣ Create a Virtual Environment

```bash & powershell
python3 -m venv venv
source venv/bin/activate
```

---

## 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```
```windows
pip install -r requirements.txt
pip install wmi pywin32
```

---

## 4️⃣ Launch the Dashboard

```bash & powershell
python3 app.py
```

---

# ⚡ Custom Terminal Command Configuration

SysMon supports customizable live terminal widgets.

## Example Configuration

```python
CUSTOM_COMMANDS = {
    "cmd_1": {
        "title": "Top Memory Processes",
        "string": "ps -eo pid,cmd,%mem --sort=-%mem | head -n 4"
    },
    "cmd_2": {
        "title": "Network Port Bindings",
        "string": "ss -tulpn | head -n 4"
    },
    "cmd_3": {
        "title": "Disk Space Status",
        "string": "df -h / | tail -n 1"
    }
}
```

---

# 🔍 Reliability & Diagnostics

## 🧠 Thermal Sensor Recovery Logic

Some Linux environments may not expose:

```bash
/sys/class/thermal/thermal_zone0/
```

### SysMon Recovery Behavior
If unavailable:
1. the exception is automatically caught
2. the backend switches to `psutil` thermal interfaces
3. dashboard telemetry continues uninterrupted

---

## 🔒 Package Manager Lock Protection

Linux package managers can temporarily lock during:
- upgrades
- repository syncs
- unattended background updates

### SysMon Solution
Package queries execute through isolated worker threads to prevent:
- frontend hangs
- blocked dashboard rendering
- telemetry interruptions

---

# 🎯 Project Goals

This project was built to strengthen practical experience with:

- Linux systems administration
- Flask backend development
- asynchronous frontend design
- subprocess management
- telemetry pipelines
- responsive dashboard interfaces
- infrastructure monitoring

---

# 📸 Screenshots

> Add screenshots or animated GIFs here.

## Example

```md
![Dashboard](screenshots/dashboard.png)
```

---

# 📁 Suggested Repository Structure

```text
SysMon-Dashboard/
│
├── app.py
├── requirements.txt
├── static/
├── templates/
├── screenshots/
├── README.md
└── LICENSE
```

---

# 📄 License

Licensed under the **MIT License**.

---

# 👨‍💻 Author

**Khwaja Mahad Haq**

- Linux Enthusiast
- Systems Administration Focused
- Automation & Infrastructure Development
- Backend & Monitoring Tooling
