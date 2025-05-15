import subprocess
import re
import json

def parse_scan_output(interface='wlxc01c30137e67'):
    raw_output = subprocess.check_output(['sudo', 'iwlist', interface, 'scan'], text=True)
    cells = raw_output.split('Cell ')
    results = []

    for cell in cells[1:]:
        address = re.search(r'Address: ([\dA-F:]+)', cell)
        channel = re.search(r'Channel:(\d+)', cell)
        essid = re.search(r'ESSID:"(.*)"', cell)
        signal = re.search(r'Signal level=(-?\d+) dBm', cell)
        quality = re.search(r'Quality=(\d+)/(\d+)', cell)
        encryption = 'on' if 'Encryption key:on' in cell else 'off'
        wpa = 'WPA' in cell or 'WPA2' in cell

        results.append({
            'mac': address.group(1) if address else None,
            'channel': int(channel.group(1)) if channel else None,
            'essid': essid.group(1) if essid else None,
            'signal': int(signal.group(1)) if signal else None,
            'quality': f"{quality.group(1)}/{quality.group(2)}" if quality else None,
            'encryption': encryption,
            'wpa': wpa
        })

    return json.dumps(results)

if __name__ == "__main__":
    print(parse_scan_output())
# This script scans for Wi-Fi networks using the iwlist command and parses the output.