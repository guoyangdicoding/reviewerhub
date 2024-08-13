import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import Header from "../shared/components/Header";
import { CirclesWithBar } from "react-loader-spinner";
import { toast } from "react-toastify";
import Footer from "../shared/components/Footer";

interface CompanyMetrics {
  workersSatisfaction: number;
  promptPayment: number;
  workLifeBalance: number;
}

interface ICompanyProfile {
  id: string;
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

const CompanyList: React.FC = () => {
  const [companies, setCompanies] = useState<ICompanyProfile[]>([]);
  const [editingCompany, setEditingCompany] = useState<ICompanyProfile | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      const querySnapshot = await getDocs(collection(db, "companies"));
      const companiesData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as ICompanyProfile[];
      setCompanies(companiesData);
    };

    fetchCompanies();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "companies", id));
    toast.success("Deleted company");
    setCompanies(companies.filter((company) => company.id !== id));
  };

  const handleEdit = (company: ICompanyProfile) => {
    setEditingCompany(company);
  };

  const handleSave = async () => {
    if (editingCompany) {
      setIsLoading(true);
      const companyRef = doc(db, "companies", editingCompany.id);
      try {
        await updateDoc(companyRef, editingCompany as any);
        setCompanies(
          companies.map((company) =>
            company.id === editingCompany.id ? editingCompany : company
          )
        );
        setIsLoading(false);
        setEditingCompany(null);
        toast.success("Updated company");
      } catch (error) {
        setIsLoading(false);
        toast.error("Error updating company");
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (editingCompany) {
      setEditingCompany({ ...editingCompany, [name]: value });
    }
  };
  // const handleMetricsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   if (editingCompany) {
  //     setEditingCompany({
  //       ...editingCompany,
  //       metrics: { ...editingCompany.metrics, [name]: Number(value) },
  //     });
  //   }
  // };

  const handleIndustryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (editingCompany) {
      setEditingCompany({ ...editingCompany, industry: value.split(",") });
    }
  };

  return (
    <>
      <Header />
      <div className="container" style={{ marginTop: 150, marginBottom: 540 }}>
        <div className="d-flex justify-content-between">
          <div>
            {" "}
            <h2 className="mb-4">Manage Companies</h2>
          </div>
          <div>
            <Link to={"/add-company"}>
              <button className="btn btn-success">Add Company</button>
            </Link>
          </div>
        </div>{" "}
        {companies.length == 0 && (
          <div className=" mt-5 text-center" style={{ marginBottom: 400 }}>
            <h4>No Company Has Been Added Yet.</h4>
          </div>
        )}
        {companies.length > 0 && (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Country</th>
                <th>Industry</th>
                <th>Actions </th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id}>
                  <td>{company.name}</td>
                  <td>{company.address}</td>
                  <td>{company.country}</td>
                  <td>{company.industry.join(", ")}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => handleEdit(company)}
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(company.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editingCompany && (
        <div className="modal" id="exampleModal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div>
                  <h3>Edit Company</h3>
                  <form>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={editingCompany.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="tagline" className="form-label">
                        Tagline
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="tagline"
                        name="tagline"
                        value={editingCompany.tagline}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="address" className="form-label">
                        Address
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="address"
                        name="address"
                        value={editingCompany.address}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="logoUrl" className="form-label">
                        Logo URL
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="logoUrl"
                        name="logoUrl"
                        value={editingCompany.logoUrl}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* <div className="mb-3">
                    <label htmlFor="starRating" className="form-label">
                      Star Rating
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="starRating"
                      name="starRating"
                      value={editingCompany.starRating}
                      onChange={handleChange}
                      required
                    />
                  </div> */}
                    {/* <div className="mb-3">
                    <label htmlFor="workersSatisfaction" className="form-label">
                      Workers Satisfaction
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="workersSatisfaction"
                      name="workersSatisfaction"
                      value={editingCompany.metrics.workersSatisfaction}
                      onChange={handleMetricsChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="promptPayment" className="form-label">
                      Prompt Payment
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="promptPayment"
                      name="promptPayment"
                      value={editingCompany.metrics.promptPayment}
                      onChange={handleMetricsChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="workLifeBalance" className="form-label">
                      Work Life Balance
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="workLifeBalance"
                      name="workLifeBalance"
                      value={editingCompany.metrics.workLifeBalance}
                      onChange={handleMetricsChange}
                      required
                    />
                  </div> */}

                    <div className="mb-3">
                      <label htmlFor="country" className="form-label">
                        Country
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="country"
                        name="country"
                        value={editingCompany.country}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="industry" className="form-label">
                        Industry (comma separated)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="industry"
                        name="industry"
                        value={editingCompany.industry.join(",")}
                        onChange={handleIndustryChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="about" className="form-label">
                        About
                      </label>
                      <textarea
                        className="form-control"
                        id="about"
                        name="about"
                        value={editingCompany.about}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>
                  </form>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => setEditingCompany(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

export default CompanyList;
