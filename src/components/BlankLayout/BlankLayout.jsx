import { initFlowbite } from "flowbite";
import { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function BlankLayout() {
  useEffect(() => {
    initFlowbite();
  }, []);

  return (
    <div>
      <div>
        <nav className="fixed top-0 z-40 w-full bg-neutral-primary-soft border-b border-default">
          <div className="px-3 py-3 lg:px-5 lg:pl-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-start rtl:justify-end">
                <button
                  data-drawer-target="top-bar-sidebar"
                  data-drawer-toggle="top-bar-sidebar"
                  aria-controls="top-bar-sidebar"
                  type="button"
                  className="sm:hidden text-heading bg-transparent box-border border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-base text-sm p-2 focus:outline-none"
                >
                  <span className="sr-only">Open sidebar</span>
                  <svg
                    className="w-6 h-6"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth={2}
                      d="M5 7h14M5 12h14M5 17h10"
                    />
                  </svg>
                </button>
                <a href="https://flowbite.com" className="flex ms-2 md:me-24">
                  <img
                    src="https://flowbite.com/docs/images/logo.svg"
                    className="h-6 me-3"
                    alt="FlowBite Logo"
                  />
                  <span className="self-center text-lg font-semibold whitespace-nowrap dark:text-white">
                    Flowbite
                  </span>
                </a>
              </div>
              <div className="flex items-center">
                <div className="flex items-center ms-3">
                  <div>
                    <button
                      type="button"
                      className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                      aria-expanded="false"
                      data-dropdown-toggle="dropdown-user"
                    >
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="w-8 h-8 rounded-full"
                        src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                        alt="user photo"
                      />
                    </button>
                  </div>
                  <div
                    className="z-50 hidden bg-neutral-primary-medium border border-default-medium rounded-base shadow-lg w-44"
                    id="dropdown-user"
                  >
                    <div
                      className="px-4 py-3 border-b border-default-medium"
                      role="none"
                    >
                      <p
                        className="text-sm font-medium text-heading"
                        role="none"
                      >
                        Mohamed Mokhtar
                      </p>
                      <p className="text-sm text-body truncate" role="none">
                        Mohamed Mokhtar
                      </p>
                    </div>
                    <ul
                      className="p-2 text-sm text-body font-medium"
                      role="none"
                    >
                      <li>
                        <a
                          href="#"
                          className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                          role="menuitem"
                        >
                          Dashboard
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                          role="menuitem"
                        >
                          Settings
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                          role="menuitem"
                        >
                          Earnings
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                          role="menuitem"
                        >
                          Sign out
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <aside
          id="top-bar-sidebar"
          className="fixed top-0 left-0 z-35 w-64 h-full transition-transform -translate-x-full sm:translate-x-0 mt-3"
          aria-label="Sidebar"
        >
          <div className="h-full px-3 py-4 overflow-y-auto bg-neutral-primary-soft border-e border-default">
            <a
              href="https://flowbite.com/"
              className="flex items-center ps-2.5 mb-5"
            >
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="h-6 me-3"
                alt="Flowbite Logo"
              />
              <span className="self-center text-lg text-heading font-semibold whitespace-nowrap">
                Flowbite
              </span>
            </a>
            <ul className="space-y-2 font-medium">
              <li>
                <NavLink
                  to="/categories"
                  className={({ isActive }) =>
                    `flex items-center px-2 py-1.5 rounded-base group ${
                      isActive
                        ? "bg-brand text-white"
                        : "text-body hover:bg-neutral-tertiary hover:text-fg-brand"
                    }`
                  }
                >
                  <span className="ms-3">Categories</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/subcategories"
                  className={({ isActive }) =>
                    `flex items-center px-2 py-1.5 rounded-base group ${
                      isActive
                        ? "bg-brand text-white"
                        : "text-body hover:bg-neutral-tertiary hover:text-fg-brand"
                    }`
                  }
                >
                  <span className="ms-3">Subcategories</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/brands"
                  className={({ isActive }) =>
                    `flex items-center px-2 py-1.5 rounded-base group ${
                      isActive
                        ? "bg-brand text-white"
                        : "text-body hover:bg-neutral-tertiary hover:text-fg-brand"
                    }`
                  }
                >
                  <span className="ms-3">Brands</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/products"
                  className={({ isActive }) =>
                    `flex items-center px-2 py-1.5 rounded-base group ${
                      isActive
                        ? "bg-brand text-white"
                        : "text-body hover:bg-neutral-tertiary hover:text-fg-brand"
                    }`
                  }
                >
                  <span className="ms-3">Products</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/coupons"
                  className={({ isActive }) =>
                    `flex items-center px-2 py-1.5 rounded-base group ${
                      isActive
                        ? "bg-brand text-white"
                        : "text-body hover:bg-neutral-tertiary hover:text-fg-brand"
                    }`
                  }
                >
                  <span className="ms-3">Coupons</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/orders"
                  className={({ isActive }) =>
                    `flex items-center px-2 py-1.5 rounded-base group ${
                      isActive
                        ? "bg-brand text-white"
                        : "text-body hover:bg-neutral-tertiary hover:text-fg-brand"
                    }`
                  }
                >
                  <span className="ms-3">Orders</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </aside>

        <div className="p-4 sm:ml-64 mt-14">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
}
