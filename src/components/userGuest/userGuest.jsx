import React from "react";
import styles from "./UserGuest.module.css";
import { Navigate } from "react-router-dom";

export default function UserGuest(props) {
  if (localStorage.getItem("token")) {
    return <Navigate to="/categories" replace />;
  } else {
    return <>{props.children}</>;
  }
}
