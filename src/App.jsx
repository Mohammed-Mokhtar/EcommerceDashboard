import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./components/AuthLayout/AuthLayout";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import BlankLayout from "./components/BlankLayout/BlankLayout";
import Categories from "./components/Categories/Categories";
import SubCategories from "./components/SubCategories/SubCategories";
import Brands from "./components/Brands/Brands";
import Products from "./components/Products/Products";
import Coupons from "./components/Coupons/Coupons";
import Orders from "./components/Orders/Orders";

import "../node_modules/flowbite/dist/flowbite.min.js";

let routes = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      { index: true, element: <Register /> },
    ],
  },
  {
    path: "/",
    element: <BlankLayout />,
    children: [
      { index: true, element: <Categories /> },
      { path: "subcategories", element: <SubCategories /> },
      { path: "brands", element: <Brands /> },
      { path: "products", element: <Products /> },
      { path: "coupons", element: <Coupons /> },
      { path: "orders", element: <Orders /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={routes} />;
}

export default App;
