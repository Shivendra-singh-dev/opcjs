import React from "react";

export default function ContactsLayout({ children }) {
  return (
    <div>
      <header
        style={{
          backgroundColor: "#1f2937",
          color: "#fff",
          padding: "15px",
        }}
      >
        <h2>Dashboard Contacts Layout</h2>
      </header>

      <main style={{ padding: "20px" }}>{children}</main>
    </div>
  );
}