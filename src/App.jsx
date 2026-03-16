import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./components/AuthLayout/AuthLayout";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import BlankLayout from "./components/BlankLayout/BlankLayout";
import Categories from "./components/Categories/Categories";
import SubCategories from "./components/SubCategories/SubCategories";
import Brands from "./components/Brands/Brands";
import Products from "./components/Products/Products";
import CategoryDetails from "./components/Products/CategoryDetails";
import SubCategoryDetails from "./components/Products/SubCategoryDetails";
import Coupons from "./components/Coupons/Coupons";
import Orders from "./components/Orders/Orders";
import UserAccount from "./components/userAccount/userAccount";
import UserGuest from "./components/userGuest/userGuest.jsx";

import "../node_modules/flowbite/dist/flowbite.min.js";
import "../node_modules/@fortawesome/fontawesome-free/css/all.min.css";

let routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <UserGuest>
        <AuthLayout />
      </UserGuest>
    ),
    children: [
      {
        path: "",
        element: <Login />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/",
    element: (
      <UserAccount>
        <BlankLayout />
      </UserAccount>
    ),
    children: [
      {
        path: "categories",
        element: <Categories />,
      },
      {
        path: "subcategories",
        element: <SubCategories />,
      },
      {
        path: "brands",
        element: <Brands />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "products/:id",
        element: <CategoryDetails />,
      },
      {
        path: "subcategory",
        element: <SubCategories />,
      },
      {
        path: "coupons",
        element: <Coupons />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={routes} />;
}

export default App;
