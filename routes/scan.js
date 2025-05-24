import { Router } from "express";
import { wifiScan } from '../controller/wifiScan.js';

const router = Router();

/**
 * @route GET /api/scan
 * @description Get scan results
 * @access Public
 */
router.get('/scan', async (req, res) => {
    try {
        await wifiScan(req, res);
    } catch (error) {
        console.error('Error fetching scan data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
