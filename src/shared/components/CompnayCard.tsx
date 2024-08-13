import { useRef, useState } from "react";
import { ICompanyProfile } from "../utils/ICompany";
import { Link } from "react-router-dom";
import { CONTRACT, onError, onSuccess } from "../useContract";
import "./card.css";
import { useAccount, useWriteContract } from "wagmi";
import ABI from "../utils/abi.json";
import { etherUnits } from "viem";

interface ReviewCardProps {
  company: ICompanyProfile;
  useInProfile?: boolean;
  reviewFee?: number;
  setLoading?: (value: boolean) => void;
  refetch?: () => void;
}

export const CompanyCard: React.FC<ReviewCardProps> = ({
  company,
  useInProfile,
  setLoading,
  refetch,
  reviewFee,
}) => {
  const [showAddReview, setShowAddReview] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    review: "",
  });
  const { isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const reviewRef = useRef(null);

  const showReview = () => {
    setShowAddReview(true);
    setTimeout(() => {
      if (reviewRef.current) {
        (reviewRef.current as any).scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 500);
  };
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading && setLoading(true);
    writeContractAsync({
      address: CONTRACT,
      abi: ABI,
      functionName: "submitReview",
      args: [
        company.name,
        formData.review,
        String(Date.now()),
        formData.name,
        formData.rating,
      ],
      value: BigInt((reviewFee || 0) * 10 ** 18),
    })
      .then((hash) => {
        setTimeout(() => {
          refetch && refetch();
          onSuccess(() => {}, "Submited review successfully");
          setFormData({ name: "", rating: 5, review: "" });
          setShowAddReview(false);
          setLoading && setLoading(false);
        }, 7000);
      })
      .catch((error) => {
        onError(error, () => {}, isConnected);
        setLoading && setLoading(false);
      });
  };

  return (
    <>
      <div className="loan-reviews_card card">
        <div className="loan-reviews__part-one">
          <div className="loan-reviews__thumb">
            <img src={company.logoUrl} alt="image" />
          </div>
        </div>
        <div className="loan-reviews__part-two">
          <div className="reviews-heading">
            <h4 className="reviews-heading__title text-center">
              {company.name}
            </h4>
            <p className="reviews-heading__content text-center">
              {company.tagline}
            </p>
            <p className="reviews-heading__content mt-3 text-center">
              <i className="bi bi-map"></i> {company.address}
            </p>
            <div className="d-flex justify-content-center">
              <div className="star_review mt-3">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`bi ${
                      i < company.ratings?.averageRating
                        ? "bi-star-fill star-active"
                        : "bi-star"
                    }`}
                  ></i>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="loan-reviews__part-three">
          <div className="btn-group">
            <Link
              className="btn_theme btn_theme_active"
              onClick={() => {
                showReview();
              }}
              to={useInProfile ? "#" : `/${company.id}`}
            >
              {useInProfile ? "Write Review" : "Review"}{" "}
              {useInProfile ? (
                <i className="bi bi-arrow-down-left"></i>
              ) : (
                <i className="bi bi-arrow-up-right"></i>
              )}
              <span></span>
            </Link>
          </div>
        </div>
      </div>

      {showAddReview && useInProfile && (
        <div className="sign-up contact mt-4" ref={reviewRef}>
          <form className="sign-up__form" onSubmit={handleSubmit}>
            <h3 className="contact__title">Write Review</h3>
            <div className="sign-up__form-part">
              <div className="input-single">
                <label className="label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  id="name"
                  placeholder="Enter Your Name..."
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-single">
                <label className="label">Rating</label>
                <select
                  name="rating"
                  className="form-control form-select"
                  id=""
                  value={formData.rating}
                  onChange={handleChange}
                >
                  <option value="1">1 star</option>
                  <option value="2">2 stars</option>
                  <option value="3">3 stars</option>
                  <option value="4">4 stars</option>
                  <option value="5">5 stars</option>
                </select>
              </div>
              <div className="input-single">
                <label className="label">Review</label>
                <textarea
                  className="form-control"
                  id="message"
                  name="review"
                  rows={8}
                  placeholder="Enter Your Message..."
                  value={formData.review}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
            </div>
            {reviewFee ? (
              <p>
                Note: To submit this review you would be charged {reviewFee} ETH
              </p>
            ) : (
              ""
            )}
            <button
              type="submit"
              className="btn_theme btn_theme_active mt_40"
              style={{ color: "#fff" }}
            >
              Submit Review <i className="bi bi-arrow-up-right"></i>
              <span></span>
            </button>
          </form>
        </div>
      )}
    </>
  );
};
