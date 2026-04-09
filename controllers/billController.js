import Bill from '../models/Bill.js';
import Product from '../models/Product.js';

export const createBill = async (req, res) => {
  try {
    const { buyerName, phone, products, totalAmount } = req.body;

    if (products && products.length === 0) {
      return res.status(400).json({ message: 'No products in bill' });
    } else {
      // Update stock
      for (const item of products) {
        if (!item.productId) continue;
        
        const productRow = await Product.findById(item.productId);
        if (productRow) {
          productRow.stock = Math.max(0, productRow.stock - item.quantity);
          await productRow.save();
        }
      }

      const bill = new Bill({
        buyerName,
        phone,
        products,
        totalAmount
      });

      const createdBill = await bill.save();
      res.status(201).json(createdBill);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating bill' });
  }
};

export const getBills = async (req, res) => {
  try {
    const bills = await Bill.find({}).sort({ date: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bills' });
  }
};

export const getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (bill) {
      res.json(bill);
    } else {
      res.status(404).json({ message: 'Bill not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bill details' });
  }
};

export const deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (bill) {
      await Bill.findByIdAndDelete(req.params.id);
      res.json({ message: 'Bill removed' });
    } else {
      res.status(404).json({ message: 'Bill not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting bill' });
  }
};
