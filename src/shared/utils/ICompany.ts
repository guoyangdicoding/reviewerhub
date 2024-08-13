export interface ICompanyProfile {
  id: number;
  name: string;
  tagline: string;
  address: string;
  logoUrl: string;
  starRating: number;
  metrics: CompanyMetrics;
  ratings: RatingAnalysis;
  reviews: Review[];
  about: string;
  country: string;
  industry: string[];
}

interface CompanyMetrics {
  workersSatisfaction: number;
  promptPayment: number;
  workLifeBalance: number;
}

interface RatingAnalysis {
  averageRating: number;
  totalRatings: number;
  ratingBreakdown: RatingBreakdown;
}

interface RatingBreakdown {
  fiveStar: number;
  fourStar: number;
  threeStar: number;
  twoStar: number;
  oneStar: number;
}

export interface Review {
  date: string;
  rating: number;
  reviewText: string;
  userName: string;
  up_votes: number;
  down_votes: number;
  user: string;
  companyName: string;
}

export interface RatingPercentages {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
}
