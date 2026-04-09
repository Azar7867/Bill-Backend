import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import billRoutes from './routes/billRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import Admin from './models/Admin.js';
import Product from './models/Product.js';

dotenv.config();
connectDB().then(async () => {
  try {
    const adminExists = await Admin.findOne({ username: 'admin' });
    if (!adminExists) {
      await Admin.create({ username: 'admin', password: 'password123' });
      console.log('Default Admin Created -> username: admin | password: password123');
    }

    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const dummyProducts = [
        {
          name: 'Urea 46% Nitrogen (50kg)',
          price: 29.99,
          stock: 150,
          image: 'https://images.unsplash.com/photo-1592424001844-0c5a2c4e38e6?q=80&w=400&fit=crop'
        },
        {
          name: 'NPK 20-20-20 Power Blend',
          price: 45.50,
          stock: 80,
          image: 'https://images.unsplash.com/photo-1574682782782-eeb66d9255ea?q=80&w=400&fit=crop'
        },
        {
          name: 'Organic Manure Compost',
          price: 15.00,
          stock: 200,
          image: 'https://images.unsplash.com/photo-1585314028308-f99a3c988b48?q=80&w=400&fit=crop'
        },
        {
          name: 'DAP (Diammonium Phosphate)',
          price: 38.00,
          stock: 50,
          image: 'https://images.unsplash.com/photo-1615814589201-9a7061d4bd8a?q=80&w=400&fit=crop'
        },
        {
          name: 'Potash MOP (Muriate of Potash)',
          price: 32.00,
          stock: 120,
          image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=400&fit=crop'
        },
        {
          name: 'SSP (Single Super Phosphate)',
          price: 25.00,
          stock: 90,
          image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=400&fit=crop'
        },
        {
          name: 'Neem Coated Urea (Govt Supply)',
          price: 30.00,
          stock: 140,
          image: 'https://images.unsplash.com/photo-1592928302636-c83cf1e1c887?q=80&w=400&fit=crop'
        },
        {
          name: 'Zinc Sulphate (Micronutrient)',
          price: 18.00,
          stock: 70,
          image: 'https://images.unsplash.com/photo-1615486511261-1a5c4c7df2b3?q=80&w=400&fit=crop'
        },
        {
          name: 'Boron Fertilizer (Borax)',
          price: 20.00,
          stock: 60,
          image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=400&fit=crop'
        },
        {
          name: 'Paddy Special Fertilizer Mix',
          price: 40.00,
          stock: 100,
          image: 'https://images.unsplash.com/photo-1598514982849-89b2f4f6a79c?q=80&w=400&fit=crop'
        },
        {
          name: 'Sugarcane Booster Fertilizer',
          price: 55.00,
          stock: 75,
          image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=400&fit=crop'
        },
        {
          name: 'Banana Growth Fertilizer Mix',
          price: 48.00,
          stock: 65,
          image: 'https://images.unsplash.com/photo-1574226516831-e1dff420e12f?q=80&w=400&fit=crop'
        },
        {
          name: 'Coconut Tree Nutrient Mix',
          price: 35.00,
          stock: 85,
          image: 'https://images.unsplash.com/photo-1598515214211-89d3cbb9b68b?q=80&w=400&fit=crop'
        },
        {
          name: 'Vermicompost (Organic Fertilizer)',
          price: 22.00,
          stock: 180,
          image: 'https://images.unsplash.com/photo-1585314028308-f99a3c988b48?q=80&w=400&fit=crop'
        },
        {
          name: 'Seaweed Liquid Fertilizer',
          price: 27.00,
          stock: 95,
          image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=400&fit=crop'
        },
        {
          name: 'Bio Fertilizer Azospirillum',
          price: 12.00,
          stock: 110,
          image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=400&fit=crop'
        },
        {
          name: 'Phosphate Solubilizing Bacteria (PSB)',
          price: 14.00,
          stock: 100,
          image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=400&fit=crop'
        }
      ];
      await Product.insertMany(dummyProducts);
      console.log('Dummy Fertilizer Products Added!');
    }
  } catch (error) {
    console.error('Failed to create default seed data', error);
  }
});

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/products', productRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
