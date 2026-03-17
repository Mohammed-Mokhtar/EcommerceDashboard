# Ecommerce Dashboard

A frontend admin dashboard for managing core e-commerce resources such as categories, subcategories, brands, products, coupons, and orders.

## Features

- Authentication pages:
  - Login
  - Register
- Dashboard pages:
  - Categories
  - Subcategories
  - Brands
  - Brand details
  - Products
  - Product details
  - Coupons
  - Coupon details
  - Orders
- Route-based app structure using React Router
- Form handling and validation with React Hook Form + Zod
- UI styling with Tailwind CSS and Flowbite

## Tech Stack

- **React**
- **Vite**
- **React Router DOM**
- **Axios**
- **React Hook Form**
- **Zod**
- **Tailwind CSS**
- **Flowbite**
- **Font Awesome**

## Project Structure

\`\`\`bash
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
\`\`\`

## Available Routes

- \`/\`
- \`/login\`
- \`/register\`
- \`/categories\`
- \`/subcategories\`
- \`/brands\`
- \`/brands/:id\`
- \`/products\`
- \`/products/:id\`
- \`/subcategory\`
- \`/coupons\`
- \`/coupons/:id\`
- \`/orders\`

## Getting Started

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/Mohammed-Mokhtar/EcommerceDashboard.git
cd EcommerceDashboard
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Run the development server

\`\`\`bash
npm run dev
\`\`\`

### 4. Build for production

\`\`\`bash
npm run build
\`\`\`

### 5. Preview the production build

\`\`\`bash
npm run preview
\`\`\`

## Scripts

\`\`\`bash
npm run dev      # Start development server
npm run build    # Build the project
npm run preview  # Preview production build
npm run lint     # Run ESLint
\`\`\`

## Environment Variables

If your app connects to an external API, create a \`.env\` file in the project root and add your variables there.

Example:

\`\`\`env
VITE_API_URL=your_api_base_url_here
\`\`\`

Then access it in your code with:

\`\`\`js
import.meta.env.VITE_API_URL
\`\`\`

## Screenshots

Add screenshots here if you want to showcase the UI.

\`\`\`markdown
![Dashboard Screenshot](./public/screenshot.png)
\`\`\`

## Future Improvements

- Add a better project description and live demo link
- Document API integration clearly
- Add role-based access control
- Improve error handling and loading states
- Add search, filtering, and pagination where needed
- Add unit and integration tests

## Author

**Mohamed Mokhtar**

- GitHub: [Mohammed-Mokhtar](https://github.com/Mohammed-Mokhtar)

## License

This project is for learning and portfolio purposes.
