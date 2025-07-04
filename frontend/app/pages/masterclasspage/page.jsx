// app/pages/masterclasspage/page.jsx
import React from "react";
import Footer from "/app/components/Footer";
import Navbar from "/app/components/Navbar";
import MasterClasses from "/app/components/MasterClasses";

const MasterclassPage = () => {
  return (
    <div>
      <Navbar />
      <div className="h-24"></div>
      <MasterClasses />
      <Footer />
    </div>
  );
};

export default MasterclassPage;
