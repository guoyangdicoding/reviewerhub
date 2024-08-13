import { useCallback, useEffect, useState } from "react";
import { FilterSidebar, SearchParams } from "./FilterSidebar";
import { ICompanyProfile } from "../utils/ICompany";
import { CompanyCard } from "./CompnayCard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { CirclesWithBar } from "react-loader-spinner";

export const ListCompany: React.FC = () => {
  const [companies, setCompanies] = useState<ICompanyProfile[]>([]);
  const item_per_page: number = 7;

  const [searchParams, setSearchParams] = useState<SearchParams>({
    searchTerm: "",
    selectedIndustries: [],
    selectedCountries: [],
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleSearchParamsChange = useCallback((params: SearchParams) => {
    setSearchParams(params);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "companies"));
        const companiesData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as any[];
        setCompanies(companiesData || []);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((company) => {
    const normalizedSearchTerm = searchParams.searchTerm.trim().toLowerCase();
    const matchesSearchTerm = company.name
      .toLowerCase()
      .includes(normalizedSearchTerm);
    const matchesIndustry =
      searchParams.selectedIndustries.length === 0 ||
      searchParams.selectedIndustries.some((industry) =>
        company.industry.includes(industry)
      );

    const matchesCountry =
      searchParams.selectedCountries.length === 0 ||
      searchParams.selectedCountries
        .map((c) => c.toLowerCase())
        .includes(company.country.toLowerCase());

    return matchesSearchTerm && matchesIndustry && matchesCountry;
  });

  const paginate = (type: "next" | "prev") => {
    window.scrollTo(0, 400);

    setCurrentPage((prevPage) => {
      if (type === "next") {
        return Math.min(
          prevPage + 1,
          Math.ceil(filteredCompanies.length / item_per_page)
        );
      } else {
        return Math.max(prevPage - 1, 1);
      }
    });
  };

  const startIndex = (currentPage - 1) * item_per_page;
  const paginatedCompanies = filteredCompanies.slice(
    startIndex,
    startIndex + item_per_page
  );

  return (
    <>
      <section className="loan-reviews loan-reviews--tertiary section py-3">
        <div className="container">
          <div className="row justify-content-center">
            <FilterSidebar onSearchParamsChange={handleSearchParamsChange} />

            <div className="col-12 col-lg-11 col-xl-9 col-xxl-8">
              <div className="d-flex flex-column gap-4">
                {paginatedCompanies.length > 0 ? (
                  paginatedCompanies.map((company, index) => (
                    <CompanyCard
                      key={index}
                      company={company}
                      useInProfile={false}
                    />
                  ))
                ) : (
                  <div className=" d-flex justify-content-center align-items-center mt-5 mb-5">
                    <div className="col-lg-6">
                      <div>
                        {" "}
                        <img
                          src="https://img.freepik.com/free-vector/flat-design-no-data-illustration_23-2150527130.jpg?t=st=1717106459~exp=1717110059~hmac=e2b73839c4c77af700936139a5380630d838b3de719facb687f7877143e75118&w=1060"
                          className="img-fluid"
                          alt=""
                        />
                      </div>
                      <div>
                        <h4 className="text-center">
                          No company match your filter criteria.
                        </h4>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {filteredCompanies.length > 0 && (
                <div className="row">
                  <div className="col-12">
                    <nav
                      aria-label="Page navigation"
                      className="nav_pagination"
                    >
                      <ul className="pagination">
                        <li
                          className={`page-item ${
                            currentPage === 1 && "disabled"
                          }`}
                        >
                          <a
                            className="page-link"
                            onClick={() => paginate("prev")}
                          >
                            <span className="prev-icon"></span>
                          </a>
                        </li>
                        <li
                          className={`page-item ${
                            currentPage ===
                              Math.ceil(
                                filteredCompanies.length / item_per_page
                              ) && "disabled"
                          }`}
                        >
                          <a
                            className="page-link"
                            onClick={() => paginate("next")}
                          >
                            <span className="next-icon"></span>
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
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
    </>
  );
};
