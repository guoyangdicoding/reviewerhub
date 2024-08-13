import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import Header from "../shared/components/Header";
import { Link } from "react-router-dom";
import { CirclesWithBar } from "react-loader-spinner";
import { toast } from "react-toastify";
import Footer from "../shared/components/Footer";

interface CompanyMetrics {
  workersSatisfaction: number;
  promptPayment: number;
  workLifeBalance: number;
}

interface ICompanyProfile {
  id: number;
  name: string;
  tagline: string;
  address: string;
  logoUrl: string;
  starRating: number;
  metrics: CompanyMetrics;
  about: string;
  country: string;
  industry: string[];
}

const AddCompany: React.FC = () => {
  const [company, setCompany] = useState<ICompanyProfile>({
    id: 0,
    name: "",
    tagline: "",
    address: "",
    logoUrl: "",
    starRating: 0,
    metrics: {
      workersSatisfaction: 0,
      promptPayment: 0,
      workLifeBalance: 0,
    },
    about: "",
    country: "",
    industry: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCompany({ ...company, [name]: value });
  };

  // const handleMetricsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setCompany({
  //     ...company,
  //     metrics: { ...company.metrics, [name]: Number(value) },
  //   });
  // };

  const handleIndustryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCompany({ ...company, industry: value.split(",") });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      console.log(company);
      await addDoc(collection(db, "companies"), company);
      setIsLoading(false);
      toast.success("Company added successfully");
      setCompany({
        id: 0,
        name: "",
        tagline: "",
        address: "",
        logoUrl: "",
        starRating: 0,
        metrics: {
          workersSatisfaction: 0,
          promptPayment: 0,
          workLifeBalance: 0,
        },
        about: "",
        country: "",
        industry: [],
      });
    } catch (error) {
      setIsLoading(false);
      toast.error("Error adding company");
    }
  };

  return (
    <>
      <Header />

      <div className="container " style={{ marginTop: 150 }}>
        <div className="d-flex justify-content-between">
          <div>
            {" "}
            <h2 className="mb-4">Add New Company</h2>
          </div>
          <div>
            <Link to={"/manage-companies"}>
              <button className="btn btn-success">Manage Companies</button>
            </Link>
          </div>
        </div>
        <form onSubmit={(e) => handleSubmit(e)} className="row">
          <div className="mb-3 col-lg-4">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={company.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3  col-lg-4">
            <label htmlFor="tagline" className="form-label">
              Tagline
            </label>
            <input
              type="text"
              className="form-control"
              id="tagline"
              name="tagline"
              value={company.tagline}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3  col-lg-4">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control"
              id="address"
              name="address"
              value={company.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3  col-lg-4">
            <label htmlFor="logoUrl" className="form-label">
              Logo URL
            </label>
            <input
              type="text"
              className="form-control"
              id="logoUrl"
              name="logoUrl"
              value={company.logoUrl}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3  col-lg-4">
            <label htmlFor="country" className="form-label">
              Country
            </label>
            <input
              type="text"
              className="form-control"
              id="country"
              name="country"
              value={company.country}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3  col-lg-4">
            <label htmlFor="industry" className="form-label">
              Industry (comma separated)
            </label>
            <input
              type="text"
              className="form-control"
              id="industry"
              name="industry"
              value={company.industry.join(",")}
              onChange={handleIndustryChange}
              required
            />
          </div>
          <div className="mb-3  col-lg-12">
            <label htmlFor="about" className="form-label">
              About
            </label>
            <textarea
              className="form-control"
              id="about"
              name="about"
              value={company.about}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="btn_theme btn_theme_active mt-5 mb-4"
          >
            Add Company
          </button>
        </form>
      </div>

      {isLoading && (
        <div className="loader-ki">
          <CirclesWithBar
            height="100"
            width="100"
            color="#fff"
            outerCircleColor="#074c3e"
            innerCircleColor="#074c3e"
            barColor="#074c3e"
            wrapperStyle={{}}
            wrapperClass=""
            visible={isLoading}
          />
        </div>
      )}

      <Footer />
    </>
  );
};

export default AddCompany;
