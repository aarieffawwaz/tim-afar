// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // <-- Pastikan ini di-import
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      {" "}
      {/* <--- BUNGKUS DI SINI */}
      <App />
    </BrowserRouter>{" "}
    {/* <--- DAN DI SINI */}
  </React.StrictMode>
);
