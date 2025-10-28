import React from "react";
import NavBar from "@/components/Landing/NavBar";
import Banner from "@/components/Landing/Banner";
import Features from "@/components/Landing/Features";
import Steps from "@/components/Landing/Steps";
import Business from "@/components/Landing/Business";
import Footer from "@/components/Landing/Footer";

const LandingPage = () => {
  return (
    <main className="min-h-screen">
      <NavBar />
      <Banner />
      <Features />
      <Steps />
      <Business />
      <Footer />
    </main>
  );
};

export default LandingPage;
