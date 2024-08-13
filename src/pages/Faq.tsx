import { useEffect, useState } from "react";
import { Banner } from "../shared/components/Banner";
import Header from "../shared/components/Header";
import Footer from "../shared/components/Footer";

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    setTimeout(() => {
      document.getElementById("faq-accordion-0-0")?.click();
    }, 1500);
  }, []);

  const faqs = [
    {
      question: "How does Reviewer Hub protect anonymity?",
      answer:
        "Reviewer Hub uses blockchain technology to securely encrypt and store reviews, ensuring that all posts remain anonymous and tamper-proof.",
    },
    {
      question: "Are the reviews on Reviewer Hub trustworthy?",
      answer:
        "Absolutely. Reviewer Hub encourages honest and constructive feedback, and our blockchain-based system ensures the integrity of all reviews.",
    },
    {
      question: "Is Reviewer Hub free to use?",
      answer:
        "Yes, Reviewer Hub is completely free. Sign up today and start sharing or reading reviews!",
    },
    {
      question: "How can I contribute to Reviewer Hub?",
      answer:
        "You can contribute by sharing your experiences through reviews, inviting others to join our community, and providing feedback to help us enhance the platform.",
    },
    {
      question: "Can companies respond to reviews on Reviewer Hub?",
      answer:
        "To protect user anonymity, companies cannot directly respond to reviews. However, companies are encouraged to use feedback constructively to improve workplace conditions.",
    },
  ];
  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex == index ? null : index);
  };
  return (
    <>
      <Header />

      <Banner title="Frequently Asked Questions" sub="FAQs" />
      <section className="section faq-section" id="faqs">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-7 col-xxl-6">
              <div className="section__header">
                <span className="section__header-sub-title headingFour">
                  --- Frequently Asked Questions
                </span>
                <h2 className="section__header-title">
                  Find Answers to Common Questions
                </h2>
              </div>
            </div>
          </div>
          <div className="row justify-content-center gy-4 gy-lg-0">
            <div className="col-12 col-lg-10 col-xxl-8">
              <div className="accordion" id="faq">
                {faqs.map((fa, i) => (
                  <div className="accordion-item accordion_bg" key={i}>
                    <h5 className="accordion-header">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#faq-accordion-${i}`}
                        aria-expanded={activeIndex === i}
                        aria-controls={`faq-accordion-${i}`}
                        onClick={() => toggleAccordion(i)}
                        id={`faq-accordion-${i}-${i}`}
                      >
                        {fa.question}
                      </button>
                    </h5>
                    <div
                      id={`faq-accordion-${i}`}
                      className={`accordion-collapse collapse ${
                        activeIndex === i ? "show" : ""
                      }`}
                      data-bs-parent="#faq"
                    >
                      <div className="accordion-body">
                        <p className="mb-0">{fa.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
