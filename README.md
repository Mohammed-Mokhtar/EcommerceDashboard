# Ecommerce Dashboard

A modern **admin dashboard for e-commerce management** built with **React** and **Vite**.  
This project provides a clean interface for handling core store resources such as **categories**, **subcategories**, **brands**, **products**, **coupons**, and **orders**.

It is designed as a frontend dashboard project with route-based navigation, reusable components, form validation, and a scalable structure that can be connected to a backend API.

---

## Demo

> Add your live demo link here when deployed

---

## Features

- User authentication pages
  - Login
  - Register

- E-commerce dashboard modules
  - Categories management
  - Subcategories management
  - Brands management
  - Brand details view
  - Products management
  - Product details view
  - Coupons management
  - Coupon details view
  - Orders management

- Frontend architecture
  - Route-based navigation with React Router
  - Reusable component-based structure
  - API-ready setup using Axios
  - Form validation using React Hook Form and Zod
  - Responsive UI styling with Tailwind CSS and Flowbite
  - Toast notifications for better user feedback

---

## Tech Stack

- **React 19**
- **Vite**
- **React Router DOM**
- **Axios**
- **React Hook Form**
- **Zod**
- **Tailwind CSS 4**
- **Flowbite**
- **Font Awesome**
- **ESLint**

---

## Project Structure

```bash
EcommerceDashboard/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── utils/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── templates/
├── index.html
├── package.json
├── vite.config.js
└── README.md
Available Pages / Routes
/
├── /login
├── /register
├── /categories
├── /subcategories
├── /brands
├── /brands/:id
├── /products
├── /products/:id
├── /subcategory
├── /coupons
├── /coupons/:id
└── /orders
Installation

Clone the repository:

git clone https://github.com/Mohammed-Mokhtar/EcommerceDashboard.git
cd EcommerceDashboard

Install dependencies:

npm install

Start the development server:

npm run dev

Build for production:

npm run build

Preview the production build:

npm run preview
Available Scripts
npm run dev      # Start development server
npm run build    # Build the app for production
npm run preview  # Preview the production build
npm run lint     # Run ESLint
Environment Variables

If you connect the dashboard to a backend API, create a .env file in the project root and add your environment variables:

VITE_API_URL=your_api_base_url_here

Use it in your code like this:

Author

Mohamed Mokhtar

GitHub: Mohammed-Mokhtar

License

This project is for learning, practice, and portfolio purposes.
