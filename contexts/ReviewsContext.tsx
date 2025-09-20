import React, { createContext, useState, useEffect } from 'react';
import { Review, ReviewsContextType } from '../types';
import { brokers } from '../data/brokers';

// Extract initial reviews from static data and give them a verified status
const initialStaticReviews: Review[] = brokers.flatMap(broker =>
  (broker.reviews || []).map(review => ({
    ...review,
    brokerId: broker.id,
    // Pre-verify some of the initial static reviews for demonstration
    verified: review.verified ?? Math.random() > 0.4 
  }))
);

export const ReviewsContext = createContext<ReviewsContextType | null>(null);

export const ReviewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const savedReviews = localStorage.getItem('allReviews');
      // If we have saved reviews, use them. Otherwise, seed with initial data.
      if (savedReviews) {
        return JSON.parse(savedReviews);
      }
    } catch (e) {
      console.error("Failed to parse reviews from localStorage", e);
    }
    return initialStaticReviews;
  });

  useEffect(() => {
    // Persist reviews to localStorage whenever they change.
    localStorage.setItem('allReviews', JSON.stringify(reviews));
  }, [reviews]);

  const getReviewsByBrokerId = (brokerId: string): Review[] => {
    return reviews.filter(review => review.brokerId === brokerId);
  };

  const getReviewsByUserId = (userId: string): Review[] => {
    return reviews.filter(review => review.userId === userId);
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'date' | 'verified'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `review_${Date.now()}`,
      date: new Date().toISOString(),
      verified: false, // All new user reviews start as unverified
    };
    setReviews(prev => [newReview, ...prev]);
  };

  const verifyReview = (reviewId: string) => {
    setReviews(prev =>
      prev.map(review =>
        review.id === reviewId ? { ...review, verified: true } : review
      )
    );
  };

  return (
    <ReviewsContext.Provider value={{ reviews, getReviewsByBrokerId, getReviewsByUserId, addReview, verifyReview }}>
      {children}
    </ReviewsContext.Provider>
  );
};