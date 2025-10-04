const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); 
const Product = require('./models/product');
const products = require('./data/productlist');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Product.deleteMany();
        await Product.insertMany(products);

        console.log('✅ Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Product.deleteMany();
        console.log('✅ Data Destroyed Successfully!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}