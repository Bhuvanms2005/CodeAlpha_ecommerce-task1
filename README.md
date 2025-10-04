# CodeAlpha_ecommerce-task1
ETHOS - Full-Stack E-Commerce Platform
ETHOS is a complete full-stack e-commerce application for a modern men's clothing brand. Built with vanilla JavaScript on the frontend and a robust Node.js/Express backend, it provides a comprehensive shopping experience from user registration to order fulfillment. The platform features a dynamic product catalog fetched from a MongoDB database, a persistent user wishlist, a session-based shopping cart, and a full checkout and order history system.

Key Features
User Authentication:

Secure user registration and login with JWT (JSON Web Token) authentication.

Password hashing using bcryptjs.

"Forgot Password" functionality with email-based reset tokens.

Product Browsing:

Dynamic main dashboard that fetches and displays product categories.

Product listing view with on-card size selection via a dropdown menu.

Shopping Cart:

Add/remove items from a temporary, session-based shopping cart.

View cart items, quantities, and total price in a slide-out drawer.

Persistent Wishlist:

Add/remove items from a user-specific wishlist that is saved to their account.

Dedicated "My Wishlist" page to view all saved items.

Checkout & Order Management:

"Buy Now" for single-item checkout.

"Proceed to Checkout" for the entire cart.

Checkout page to collect shipping address and payment information.

Order creation and storage in the database.

A "My Orders" page to view personal order history with status tracking.

Functionality for users to cancel their own orders.

User Profile:

A dedicated page to view and edit user details (name, email).

An integrated view of personal order history.

Technology Stack
Frontend:

HTML5

CSS3

Vanilla JavaScript (ES6+)

Backend:

Node.js

Express.js

MongoDB with Mongoose

JSON Web Tokens (JWT) for authentication

dotenv for environment variables

Nodemailer for email services

Setup and Installation
Prerequisites
Node.js and npm installed

MongoDB Atlas account or a local MongoDB instance

Backend Setup (e-commercebackend)
Navigate to the backend directory: cd e-commercebackend

Install dependencies: npm install

Create a .env file in the root of the backend folder and add the following variables:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
Populate the database with initial product data: npm run data:import

Start the backend server: npm run server

Frontend Setup (e-commercefrontend)
Navigate to the frontend directory: cd e-commercefrontend

Run the dashboard.html file using a live server extension (like VS Code's "Live Server").

The application will be running with the frontend on your Live Server port (e.g., http://127.0.0.1:5500) and the backend on http://localhost:5000.
