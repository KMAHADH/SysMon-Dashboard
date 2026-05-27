/* ==============================================================================
   File Name     : monitor.js (Sysmon Dynamic Integration Engine)
   Description   : Real-time asynchronous payload extraction for 11-card grid
   ============================================================================== */

function updateDashboard(data) {
    if (!data || data.status === "error") {
        console.error("Backend Telemetry Interrupt:", data ? data.message : "Null Payload");
        return;
    }

    try {
        // --- System State Banner Tracker ---
        if (data.uptime) {
            document.getElementById('uptime-val').innerText = data.uptime;
        }
        
        // --- CPU Utilization & Threads Configuration ---
        if (data.cpu) {
            document.getElementById('cpu-text').innerText = `${data.cpu.percent}%`;
            document.getElementById('cpu-bar').style.width = `${data.cpu.percent}%`;
            document.getElementById('cpu-footer').innerText = `Threads Active: ${data.cpu.threads} (${data.cpu.physical_cores} Cores)`;
        }

        // --- Memory Resource Allocation ---
        if (data.memory) {
            document.getElementById('ram-text').innerText = `${data.memory.percent}%`;
            document.getElementById('ram-bar').style.width = `${data.memory.percent}%`;
            document.getElementById('ram-footer').innerText = `Using ${data.memory.used_gb} GB / ${data.memory.total_gb} GB`;
        }

        // --- Swap Disk Space Processing ---
        if (data.swap) {
            document.getElementById('swap-text').innerText = `${data.swap.percent}%`;
            document.getElementById('swap-bar').style.width = `${data.swap.percent}%`;
            document.getElementById('swap-footer').innerText = `Using ${data.swap.used_gb} GB / ${data.swap.total_gb} GB`;
            // Warning style switch if swap allocation climbs beyond safe thresholds
            document.getElementById('swap-bar').style.backgroundColor = data.swap.percent > 10 ? '#f59e0b' : '#38bdf8';
        }

        // --- Core Storage Footprints ---
        if (data.disk) {
            document.getElementById('disk-text').innerText = `${data.disk.percent}%`;
            document.getElementById('disk-bar').style.width = `${data.disk.percent}%`;
            document.getElementById('disk-footer').innerText = `Using ${data.disk.used_gb} GB / ${data.disk.total_gb} GB`;
        }

        // --- Thermals Monitoring ---
        if (data.temperature_c !== undefined) {
            const tempText = data.temperature_c === 0.0 ? "N/A" : `${data.temperature_c}°C`;
            document.getElementById('temp-text').innerText = tempText;
        }

        // --- Active Interface Processing ---
        if (data.network_details) {
            document.getElementById('net-interface').innerText = data.network_details.interface;
            document.getElementById('net-ip').innerText = data.network_details.ip;
            document.getElementById('net-mac').innerText = data.network_details.mac.toUpperCase();
        }

        // --- Operational Network Bandwidth Rates ---
        if (data.network_speed && data.network_totals) {
            document.getElementById('net-down').innerText = `${data.network_speed.download_kbps} KB/s`;
            document.getElementById('net-up').innerText = `${data.network_speed.upload_kbps} KB/s`;
            document.getElementById('total-recv').innerText = `${data.network_totals.total_recv_gb} GB`;
            document.getElementById('total-sent').innerText = `${data.network_totals.total_sent_gb} GB`;
        }

        // --- Systemd Engine Service States ---
        if (data.services) {
            updateServicePill('srv-ssh', data.services.ssh);
            updateServicePill('srv-ufw', data.services.ufw);
            updateServicePill('srv-cron', data.services.cron);
        }

        // --- Pending Updates Asset Badges ---
        if (data.upgrades) {
            document.getElementById('pkg-apt').innerText = data.upgrades.apt;
            document.getElementById('pkg-snap').innerText = data.upgrades.snap;
            document.getElementById('pkg-flatpak').innerText = data.upgrades.flatpak;

            toggleBadgeAlert('pkg-apt', data.upgrades.apt);
            toggleBadgeAlert('pkg-snap', data.upgrades.snap);
            toggleBadgeAlert('pkg-flatpak', data.upgrades.flatpak);
        }

        // --- Dynamic Incident Log Feed Stream ---
        if (data.logs) {
            const logBox = document.getElementById('log-feed');
            if (logBox) {
                logBox.innerHTML = ''; // Flush old logs
                data.logs.forEach(line => {
                    const logLineDiv = document.createElement('div');
                    logLineDiv.className = 'log-line';
                    logLineDiv.innerText = line;
                    logBox.appendChild(logLineDiv);
                });
            }
        }

 // --- DATA INJECTION: MULTI-BASH TERMINAL MONITORS ---
        if (data.custom_commands) {
            // Define structural map array linking JSON payloads to DOM layout elements
            const commandSlots = [
                { key: 'cmd_1', labelId: 'cmd1-label', stringId: 'cmd1-string', feedId: 'cmd1-feed' },
                { key: 'cmd_2', labelId: 'cmd2-label', stringId: 'cmd2-string', feedId: 'cmd2-feed' },
                { key: 'cmd_3', labelId: 'cmd3-label', stringId: 'cmd3-string', feedId: 'cmd3-feed' }
            ];

            commandSlots.forEach(slot => {
                const cmdData = data.custom_commands[slot.key];
                if (cmdData) {
                    // Update header title metrics fields safely
                    const labelEl = document.getElementById(slot.labelId);
                    const stringEl = document.getElementById(slot.stringId);
                    if (labelEl) labelEl.innerText = cmdData.label;
                    if (stringEl) stringEl.innerText = cmdData.string;

                    // Rebuild inner log text rows
                    const feedBox = document.getElementById(slot.feedId);
                    if (feedBox) {
                        feedBox.innerHTML = '';
                        cmdData.output.forEach(line => {
                            const lineDiv = document.createElement('div');
                            lineDiv.className = 'log-line';
                            lineDiv.innerText = line;
                            feedBox.appendChild(lineDiv);
                        });
                    }
                }
            });
        }

    } catch (err) {
        console.error("DOM Parsing Exception inside UI Sync Loop:", err);
    }
}

function updateServicePill(elementId, status) {
    const el = document.getElementById(elementId);
    if (!el) return;
    
    el.innerText = status.toUpperCase();
    if (status === "active") {
        el.style.backgroundColor = '#16a34a'; // Green
        el.style.color = '#ffffff';
    } else if (status === "inactive") {
        el.style.backgroundColor = '#dc2626'; // Red
        el.style.color = '#ffffff';
    } else {
        el.style.backgroundColor = '#475569'; // Slate
        el.style.color = '#cbd5e1';
    }
}

function toggleBadgeAlert(elementId, count) {
    const el = document.getElementById(elementId);
    if (!el) return;
    
    if (count > 0) {
        el.style.backgroundColor = '#dc2626';
        el.style.color = '#ffffff';
    } else {
        el.style.backgroundColor = '#334155';
        el.style.color = '#94a3b8';
    }
}

async function fetchMetrics() {
    try {
        const response = await fetch('/api/metrics');
        if (!response.ok) throw new Error(`HTTP Endpoint Error Code: ${response.status}`);
        const data = await response.json();
        updateDashboard(data);
    } catch (error) {
        console.error("Telemetry Endpoint Sync Interrupted:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchMetrics();
    setInterval(fetchMetrics, 2000); // Poll every 2 seconds
});
