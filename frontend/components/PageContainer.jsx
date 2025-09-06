import React from "react";
// components/PageContainer.jsx
export default function PageContainer({ children }) {
  return (
    <div className="ml-20 md:ml-64 p-6 min-h-screen transition-[margin] duration-300 ease-in-out">
      {children}
    </div>
  );
}
