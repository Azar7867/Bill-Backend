import express from 'express';
import { createBill, getBills, getBillById, deleteBill } from '../controllers/billController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(createBill).get(protect, getBills);
router.route('/:id').get(protect, getBillById).delete(protect, deleteBill);

export default router;
