import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import { configDotenv } from 'dotenv';
import { LOG } from './logger.js';

// Load environment variables
configDotenv();

const app = express();
const PORT = process.env.PORT || 3000;
const SUDO_PASSWORD = process.env.SUDO_PASSWORD;

if (!SUDO_PASSWORD) {
        LOG.error('SUDO_PASSWORD environment variable is not set');
        LOG.info("Did you forget to set the SUDO_PASSWORD environment variable?");
        process.exit(1);
}

app.use(cors());

// Add logging middleware
app.use((req, res, next) => {
        LOG.info(`${req.method} ${req.url}`);
        next();
});

// Endpoint to trigger WiFi scan for now
app.get('/api/wifi/scan', (_req, res) => {
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
                LOG.info(`Process exited with code ${code}`);
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
});

app.listen(PORT, () => LOG.info(`Server running at http://localhost:${PORT}`));