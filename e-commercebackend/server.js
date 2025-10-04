const express=require('express');
const dotenv=require('dotenv');
const connectDB=require('./config/db');
const cors=require('cors');
dotenv.config();
connectDB();
const app=express();
app.use(express.json());
app.use(cors());
app.use('/api/auth',require('./routes/authRoutes'));
app.use('/api/products', require('./routes/product'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/userRoutes'));
const PORT=process.env.PORT||5000;
app.listen(PORT,()=>console.log(`Server is running on port:${PORT}`));

