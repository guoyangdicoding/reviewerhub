import { useEffect, useState } from "react";
import { Banner } from "../shared/components/Banner";
import { CompanyCard } from "../shared/components/CompnayCard";
import {
  ICompanyProfile,
  RatingPercentages,
  Review,
} from "../shared/utils/ICompany";
import { useParams } from "react-router-dom";
import { CONTRACT, onError, onSuccess } from "../shared/useContract";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import ABI from "../shared/utils/abi.json";
import { CirclesWithBar } from "react-loader-spinner";
import Header from "../shared/components/Header";
import Footer from "../shared/components/Footer";
import { collection, doc, getDoc, where } from "firebase/firestore";
import { db } from "../firebase";

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, index) => {
    const starValue = index + 1;

    if (rating >= starValue) {
      return <i key={index} className="bi bi-star-fill star-active" />;
    } else if (rating >= starValue - 0.5) {
      return <i key={index} className="bi bi-star-half star-active" />;
    } else {
      return <i key={index} className="bi bi-star star-active" />;
    }
  });

  return <div className="star_review">{stars}</div>;
};

export default function CompanyProfile() {
  const [company, setCompany] = useState<ICompanyProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [average_rating, setAverageRating] = useState<number>(0);
  const { writeContractAsync } = useWriteContract();
  const [reviewFee, setReviewFee] = useState<number>(0);
  const { isConnected } = useAccount();
  const [percentage, setPercentage] = useState<RatingPercentages>({
    "1": "0",
    "2": "0",
    "3": "0",
    "4": "0",
    "5": "0",
  });

  const params: any = useParams();
  const { refetch: refetch } = useReadContract({
    address: CONTRACT,
    abi: ABI,
    functionName: "getCompanyReviews",
    args: [(company?.name as any) || "00"],
  });

  const { refetch: refetchReviewFee } = useReadContract({
    address: CONTRACT,
    abi: ABI,
    functionName: "getReviewFee",
  });

  const { refetch: refetchAverageRating } = useReadContract({
    address: CONTRACT,
    abi: ABI,
    functionName: "getAverageRating",
    args: [(company?.name as any) || "00"],
  });

  const getData = async () => {
    try {
      const res = await refetch();
      const res_ar = await refetchAverageRating();
      const reviewFee = await refetchReviewFee();

      setAverageRating(Number(res_ar.data));
      setReviewFee(Number(reviewFee.data) / 10 ** 18);
      setCompany((prev: any) => ({
        ...prev,
        reviews: res.data,
      }));
      setPercentage(calculateRatingPercentages(res.data as Review[]));
    } catch (error) {}
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    getCompany(params.id);

    setTimeout(() => {
      getData();
    }, 500);
  }, []);

  const getCompany = async (id: string) => {
    try {
      const docRef = doc(db, "companies", id);
      const docSnap = await getDoc(docRef);
      setCompany(docSnap.data() as any);
    } catch (err) {}
  };

  const calculateRatingPercentages = (reviews: Review[]) => {
    let ratingCounts: any = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    reviews.forEach((review) => {
      if (ratingCounts.hasOwnProperty(review.rating)) {
        ratingCounts[review.rating]++;
      }
    });

    const totalReviews = reviews.length;

    let ratingPercentages: any = {};
    for (let rating in ratingCounts) {
      if (ratingCounts.hasOwnProperty(rating)) {
        ratingPercentages[rating] = (
          (ratingCounts[rating] / totalReviews) *
          100
        ).toFixed(2);
      }
    }

    return ratingPercentages;
  };

  const handleReviewVote = (
    type: "upVoteReview" | "downVoteReview",
    reviewIndex: number
  ) => {
    setIsLoading(true);
    writeContractAsync({
      address: CONTRACT,
      abi: ABI,
      functionName: type,
      args: [company?.name, reviewIndex],
    })
      .then((hash) => {
        setTimeout(async () => {
          await getData();
          onSuccess(() => {}, "Voted review successfully");
          setIsLoading(false);
        }, 7000);
      })
      .catch((error) => {
        onError(error, () => {}, isConnected);
        setIsLoading(false);
      });
  };

  const generateShareUrl = (platform: string) => {
    const encodedText = encodeURIComponent(
      "Hi, you can submit your review about" +
        " " +
        company?.name +
        " " +
        "here" +
        " " +
        window.location.href
    );
    switch (platform) {
      case "facebook":
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedText}`;
      case "twitter":
        return `https://twitter.com/intent/tweet?text=${encodedText}`;
      case "instagram":
        return `https://www.instagram.com/`;
      case "whatsapp":
        return `https://wa.me/?text=${encodedText}`;
      case "reddit":
        return `https://www.reddit.com/submit?title=${encodedText}`;
      case "discord":
        return `https://discord.com/channels/@me`;
      case "tiktok":
        return `https://www.tiktok.com/`;
      default:
        return "#";
    }
  };

  return (
    <>
      <Header />

      {company && (
        <>
          {" "}
          <Banner title={company.name} sub="Company Profile" />
          <section className="reviews-details section">
            <div className="container ">
              <div className="row">
                <div className="col-12 col-xl-8 order-1 order-xl-0">
                  <div className="reviews-details__area">
                    <div className="reviews-details__part ">
                      <div className="loan-reviews loan-reviews--quaternary ">
                        <CompanyCard
                          company={company}
                          useInProfile={true}
                          setLoading={(status) => setIsLoading(status)}
                          refetch={() => getData()}
                          reviewFee={reviewFee}
                        />
                      </div>
                      <div className="section__content ">
                        <h2 className="section__content-title">
                          About This Company
                        </h2>
                        <p className="section__content-text">{company.about}</p>
                      </div>
                    </div>
                    <div className="reviews-details__part ">
                      <div className="average-reviews">
                        <h4 className="average-reviews__title">
                          {" "}
                          Rating Analysis
                        </h4>
                        <div className="gap-9 flex-wrap flex-md-nowrap average-reviews__content">
                          <div className="average-reviews__card">
                            <p className="average-reviews__count">
                              <span className="headingTwo">
                                {((average_rating || 0) / 10).toFixed(1) || 0}
                              </span>
                              /5
                            </p>
                            <p>
                              {" "}
                              <StarRating rating={average_rating / 10} />
                              Rating
                            </p>
                          </div>
                          <div className="progress-area">
                            <div className="progress-area__part">
                              <span className="gap-1">
                                5 <i className="bi bi-star-fill star-active" />
                              </span>
                              <div className="prog-bar">
                                <div
                                  className="prog-percentage"
                                  style={{
                                    maxWidth: `${Number(percentage["5"])}%`,
                                  }}
                                />
                              </div>
                              <span>{Number(percentage["5"]) || 0}%</span>
                            </div>
                            <div className="progress-area__part">
                              <span className="gap-1">
                                4 <i className="bi bi-star-fill star-active" />
                              </span>
                              <div className="prog-bar">
                                <div
                                  className="prog-percentage"
                                  style={{
                                    maxWidth: `${Number(percentage["4"])}%`,
                                  }}
                                />
                              </div>
                              <span>{Number(percentage["4"]) || 0}%</span>
                            </div>
                            <div className="progress-area__part">
                              <span className="gap-1">
                                3 <i className="bi bi-star-fill star-active" />
                              </span>
                              <div className="prog-bar">
                                <div
                                  className="prog-percentage"
                                  style={{
                                    maxWidth: `${Number(percentage["3"])}%`,
                                  }}
                                />
                              </div>
                              <span> {Number(percentage["3"]) || 0}%</span>
                            </div>
                            <div className="progress-area__part">
                              <span className="gap-1">
                                2 <i className="bi bi-star-fill star-active" />
                              </span>
                              <div className="prog-bar">
                                <div
                                  className="prog-percentage"
                                  style={{
                                    maxWidth: `${Number(percentage["2"])}%`,
                                  }}
                                />
                              </div>
                              <span> {Number(percentage["2"]) || 0}%</span>
                            </div>
                            <div className="progress-area__part">
                              <span className="gap-1">
                                1 <i className="bi bi-star-fill star-active" />
                              </span>
                              <div className="prog-bar">
                                <div
                                  className="prog-percentage"
                                  style={{
                                    maxWidth: `${Number(percentage["1"])}%`,
                                  }}
                                />
                              </div>
                              <span> {Number(percentage["1"]) || 0}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="comments-area">
                        <div className="space_between">
                          <h4>People's Reviews</h4>
                        </div>
                        {company.reviews?.map((review, index) => (
                          <div className="author__content ">
                            <div className="gap-7">
                              <div className="author__thumbs">
                                <img
                                  src="https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg?w=1060&t=st=1716048710~exp=1716049310~hmac=53907883829283b4ffa26bdc0ab469cf09567603819e27c939254c78d74597c1"
                                  alt="image"
                                  style={{ width: 50 }}
                                />
                              </div>
                              <div className="author__info">
                                <h5 className="author__name">
                                  {review.userName}
                                </h5>
                                <div className="d-flex gap-2">
                                  <div>
                                    <p>
                                      {`${review.user?.slice(
                                        0,
                                        4
                                      )}...${review.user?.slice(-4)}`}{" "}
                                      <i className="bi bi-dot" />{" "}
                                    </p>{" "}
                                  </div>
                                  <div>
                                    <p>
                                      {" "}
                                      {
                                        new Date(Number(review.date))
                                          .toISOString()
                                          ?.split("T")[0]
                                      }{" "}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="author__text">
                              <div className="star_review">
                                <StarRating rating={Number(review.rating)} />
                              </div>
                              <p>{review.reviewText}</p>
                            </div>

                            <div className="feedback">
                              <div className="gap-9 feedback__content">
                                <a
                                  href="javascript:void(0)"
                                  className="like"
                                  onClick={() =>
                                    handleReviewVote("upVoteReview", index)
                                  }
                                >
                                  {Number(review.up_votes)}{" "}
                                  <i className="bi bi-hand-thumbs-up" />
                                </a>
                                <a
                                  href="javascript:void(0)"
                                  className="like"
                                  onClick={() =>
                                    handleReviewVote("downVoteReview", index)
                                  }
                                >
                                  {Number(review.down_votes)}{" "}
                                  <i className="bi bi-hand-thumbs-down" />
                                </a>
                              </div>
                              <div className="reply__content">
                                <div className="gap-7">
                                  <div className="author__thumbs">
                                    <img
                                      src="assets/images/author2.png"
                                      alt="Author"
                                    />
                                  </div>
                                  <form method="POST" className="reply__form">
                                    <div>
                                      <input
                                        type="text"
                                        className="form-control"
                                        name="reply__text"
                                        placeholder="Join the discussion..."
                                      />
                                      <button
                                        type="submit"
                                        className="d-none"
                                        name="reply__submit"
                                      >
                                        Submit
                                      </button>
                                    </div>
                                    <span id="reply__commentsMsg" />
                                  </form>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {(company.reviews?.length == 0 || !company.reviews) && (
                          <div className="d-flex justify-content-center align-item-center">
                            <div className="col-lg-4">
                              {" "}
                              <img
                                src="https://img.freepik.com/free-vector/business-background-design_1343-21.jpg?t=st=1716413204~exp=1716416804~hmac=9a541373b0b81e0a5ac35f2edbafe466813252705d9718df9809c1966c9ba408&w=1060"
                                alt=""
                                className="img-fluid"
                              />
                              <div>
                                <h5>Oops... No Review For Now.</h5>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="section__cta text-start mt_40">
                        {company.reviews?.length > 0 && (
                          <a className="btn_theme btn_theme_active">
                            See More Reviews{" "}
                            <i className="bi bi-arrow-up-right" />
                            <span />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-xl-4 btn_sticky">
                  <div className="sidebar sidebar_fixed sidebar-xl-fixed cus_scrollbar">
                    <div className="sidebar__part">
                      <h4 className="sidebar__part-title">Share with others</h4>
                      <div className="social mt_32">
                        {[
                          "facebook",
                          "twitter",
                          "instagram",
                          "whatsapp",
                          "reddit",
                          "discord",
                          "tiktok",
                        ].map((platform) => (
                          <a
                            key={platform}
                            href={generateShareUrl(platform)}
                            className="btn_theme social_box btn_bg_white"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i
                              className={`bi bi-${platform}`}
                              style={{ color: "#074c3e" }}
                            />
                            <span />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {!company && <div style={{ height: "100vh" }}></div>}

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
}
