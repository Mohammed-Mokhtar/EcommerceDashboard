# Ecommerce Dashboard

A modern frontend admin dashboard for managing core e-commerce entities through a clean, route-based interface. This project focuses on building a practical dashboard experience with authentication flows, validated forms, reusable CRUD patterns, and detail views for catalog management modules.

It is designed as a portfolio-ready React application that demonstrates how to structure an admin panel for real-world product operations without overstating the scope. The app communicates with an external e-commerce API and currently centers on frontend dashboard workflows rather than a bundled backend.

## Overview

**Ecommerce Dashboard** is a single-page admin interface built with React and Vite for managing common e-commerce resources such as categories, subcategories, brands, products, and coupons. The application includes authentication pages, protected routes, modal-driven create/edit/delete flows, and dedicated detail pages for selected entities.

The codebase showcases practical frontend engineering skills including:

- Component-based dashboard architecture
- Route protection for guest and authenticated users
- Form validation with `React Hook Form` and `Zod`
- API integration using `Axios`
- UI composition with `Tailwind CSS` and `Flowbite`
- User feedback through toast notifications
- Linting setup with `ESLint`

## Main Features

- Authentication flow with login and registration pages
- Protected dashboard routes for authenticated users
- Guest-only auth routes with redirect handling
- Sidebar-based admin navigation
- Category management with add, edit, delete, and image upload support
- Subcategory management with parent category assignment
- Brand management with list, detail view, create, edit, and delete actions
- Product management with:
  - title, description, price, and stock fields
  - category, subcategory, and brand assignment
  - cover image and gallery image uploads
  - dedicated product details page
- Coupon management with:
  - code, discount, and expiration date fields
  - create, edit, delete, and detail view flows
- Toast-based success and error feedback
- Responsive UI patterns using Tailwind and Flowbite components

## Tech Stack

- **React 19**
- **Vite**
- **React Router DOM**
- **Axios**
- **React Hook Form**
- **Zod**
- **@hookform/resolvers**
- **Tailwind CSS**
- **Flowbite**
- **Font Awesome**
- **React Hot Toast**
- **ESLint**

## Project Structure

```text
EcommerceDashboard/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── AuthLayout/
│   │   ├── BlankLayout/
│   │   ├── Login/
│   │   ├── Register/
│   │   ├── Categories/
│   │   ├── SubCategories/
│   │   ├── Brands/
│   │   ├── Products/
│   │   ├── Coupons/
│   │   ├── Orders/
│   │   ├── userAccount/
│   │   └── userGuest/
│   ├── utils/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── App.css
├── eslint.config.js
├── vite.config.js
├── package.json
└── README.md
```

## Available Pages / Routes

| Route | Description |
| --- | --- |
| `/` | Login page |
| `/login` | Login page |
| `/register` | Register page |
| `/categories` | Categories management page |
| `/subcategories` | Subcategories management page |
| `/subcategory` | Alternate route pointing to subcategories |
| `/brands` | Brands listing and management |
| `/brands/:id` | Brand details page |
| `/products` | Products listing and management |
| `/products/:id` | Product details page |
| `/coupons` | Coupons listing and management |
| `/coupons/:id` | Coupon details page |
| `/orders` | Orders route currently present but not yet implemented |

## Installation

### Prerequisites

- Node.js
- npm

### Steps

```bash
git clone https://github.com/Mohammed-Mokhtar/EcommerceDashboard.git
cd EcommerceDashboard
npm install
npm run dev
```

Then open the local development URL shown by Vite, usually:

```bash
http://localhost:5173
```

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Creates a production build |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs ESLint across the project |

## Notes

- This project is a **frontend dashboard application**.
- It integrates with an **external API** at `https://nti-ecommerce.vercel.app/api/v1/...`.
- The repository does **not** include a full backend implementation.

## Repository

- GitHub: [Mohammed-Mokhtar/EcommerceDashboard](https://github.com/Mohammed-Mokhtar/EcommerceDashboard)

## Author

**Mohamed Mokhtar**

Frontend developer focused on building practical, polished web applications with modern React tooling.

- GitHub: [@Mohammed-Mokhtar](https://github.com/Mohammed-Mokhtar)

