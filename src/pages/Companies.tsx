import React, { useEffect } from "react";
import { ListCompany } from "../shared/components/ListCompany";
import { Banner } from "../shared/components/Banner";
import Header from "../shared/components/Header";
import Footer from "../shared/components/Footer";

const Companies: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Header />

      <Banner title="Explore Companies For Review" sub=" Review A Company" />
      <ListCompany />
      <Footer />
    </>
  );
};

export default Companies;
