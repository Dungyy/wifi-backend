import { spawn } from 'child_process';
import { LOG } from '../logger.js';
import { SUDO_PASSWORD } from '../config.js';

export const wifiScan = (req, res) => {
    LOG.info('Starting WiFi scan...');
    const child = spawn('sudo', ['-S', 'python3', 'wifi_scan.py']);

    let stdoutData = '';
    let stderrData = '';

    // Write password to stdin
    child.stdin.write(SUDO_PASSWORD + '\n');
    child.stdin.end();
    child.stdout.on('data', (data) => {
        stdoutData += data.toString();
        LOG.info('Received stdout data chunk');
    });

    child.stderr.on('data', (data) => {
        stderrData += data.toString();
        LOG.info(`Error: ${data.toString()}`);
    });

    child.on('close', (code) => {
        if (code !== 0) {
            LOG.info(`Process failed with error: ${stderrData}`);
            return res.status(500).json({ error: stderrData });
        }
        try {
            LOG.info('Successfully completed WiFi scan');
            res.json(JSON.parse(stdoutData));
        } catch (error) {
            LOG.info(`Failed to parse output as JSON: ${error.message}`);
            res.status(500).json({ error: 'Failed to parse output as JSON' });
        }
    });
};