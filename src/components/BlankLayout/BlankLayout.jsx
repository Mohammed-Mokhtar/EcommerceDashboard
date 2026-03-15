import React from "react";
import { Outlet } from "react-router-dom";
import styles from "./BlankLayout.module.css";

export default function BlankLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
