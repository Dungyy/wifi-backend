import express from 'express';
import cors from 'cors';
import { LOG } from './logger.js';
import router from './routes/scan.js';
import { SUDO_PASSWORD, PORT, } from './config.js';

const app = express();
app.use(cors());

app.use((req, res, next) => {
    LOG.info(`Received request: ${req.method} ${req.url}`);
    next();
});

app.use("/wifi", router);

if (!SUDO_PASSWORD) {
        LOG.error('SUDO_PASSWORD environment variable is not set');
        LOG.info("Did you forget to set the SUDO_PASSWORD environment variable?");
        process.exit(1);
}

app.listen(PORT, () => LOG.info(`Server running at http://localhost:${PORT}`));