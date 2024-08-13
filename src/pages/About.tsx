import { useEffect } from "react";
import { Banner } from "../shared/components/Banner";
import Header from "../shared/components/Header";
import Footer from "../shared/components/Footer";

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Header />

      <Banner title="About Us" sub="About Us" />
      <section className="about-guideline section" id="about">
        <div className="container">
          <div className="row gy-5 gy-lg-0 justify-content-between align-items-center">
            <div className="col-12 col-lg-7 col-xxl-6">
              <div className="section__content me-lg-5 me-xxl-0">
                <span className="section__content-sub-title headingFour">
                  --- About Us
                </span>
                <h2 className="section__content-title">
                  Empowering voices, fostering transparency, one review at a
                  time.
                </h2>
                <p className="section__content-text">
                  At Reviewers Hub, we believe in empowering individuals to
                  share their experiences honestly and securely. Our platform
                  leverages blockchain technology to ensure that every review
                  posted remains anonymous and tamper-proof.
                </p>
                <p className="section__content-text">
                  We're committed to fostering transparency in company reviews,
                  giving voice to employees, freelancers, and workers worldwide.
                  Join us in shaping a future where feedback is impactful and
                  trustworthy. Your experiences matter, and we are here to make
                  sure they're heard.
                </p>
                <div className="btn-group align-items-center">
                  <a className="btn_theme btn_theme_active">
                    Read More <i className="bi bi-arrow-up-right" />
                    <span />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-8 col-md-8 col-lg-5 mx-auto mx-lg-0">
              <div className="choose-us__thumb unset-xxl me-xl-4 me-xxl-0">
                <img src="assets/images/Online Review-pana.svg" alt="images" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
