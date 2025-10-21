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

// Validation utilities - moved before usage
const isValidBrokerId = (id: unknown): id is string => {
  return typeof id === 'string' && id.trim().length > 0 && id.trim().length <= 100;
};

const isValidUserId = (id: unknown): id is string => {
  return typeof id === 'string' && id.trim().length > 0 && id.trim().length <= 100;
};

const sanitizeReviews = (reviewsList: unknown): Review[] => {
  if (!Array.isArray(reviewsList)) {
    return initialStaticReviews;
  }

  return reviewsList.filter(review => {
    return (
      review &&
      typeof review === 'object' &&
      isValidBrokerId(review.brokerId) &&
      isValidUserId(review.userId) &&
      typeof review.rating === 'number' &&
      review.rating >= 1 &&
      review.rating <= 5 &&
      typeof review.title === 'string' &&
      review.title.trim().length > 0 &&
      typeof review.comment === 'string' &&
      review.comment.trim().length > 0
    );
  });
};

export const ReviewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      // Check if we're on the client side
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedReviews = window.localStorage.getItem('allReviews');
        // If we have saved reviews, use them. Otherwise, seed with initial data.
        if (savedReviews) {
          const parsed = JSON.parse(savedReviews);
          return sanitizeReviews(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to parse reviews from localStorage", e);
    }
    // Return initial static reviews for server-side rendering
    return initialStaticReviews;
  });

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      // Persist reviews to localStorage whenever they change.
      localStorage.setItem('allReviews', JSON.stringify(reviews));
    }
  }, [reviews]);

  const getReviewsByBrokerId = (brokerId: unknown): Review[] => {
    if (!isValidBrokerId(brokerId)) {
      console.warn('Invalid broker ID provided to getReviewsByBrokerId:', brokerId);
      return [];
    }
    return reviews.filter(review => review.brokerId === brokerId.trim());
  };

  const getReviewsByUserId = (userId: unknown): Review[] => {
    if (!isValidUserId(userId)) {
      console.warn('Invalid user ID provided to getReviewsByUserId:', userId);
      return [];
    }
    return reviews.filter(review => review.userId === userId.trim());
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'date' | 'verified'>) => {
    // Validate review data
    if (!reviewData || typeof reviewData !== 'object') {
      throw new Error('Invalid review data provided');
    }

    if (!isValidBrokerId(reviewData.brokerId)) {
      throw new Error('Invalid broker ID in review data');
    }

    if (!isValidUserId(reviewData.userId)) {
      throw new Error('Invalid user ID in review data');
    }

    if (typeof reviewData.rating !== 'number' || reviewData.rating < 1 || reviewData.rating > 5) {
      throw new Error('Rating must be a number between 1 and 5');
    }

    if (!reviewData.title || typeof reviewData.title !== 'string' || reviewData.title.trim().length === 0) {
      throw new Error('Review title is required');
    }

    if (!reviewData.comment || typeof reviewData.comment !== 'string' || reviewData.comment.trim().length === 0) {
      throw new Error('Review comment is required');
    }

    const newReview: Review = {
      brokerId: reviewData.brokerId.trim(),
      userId: reviewData.userId.trim(),
      rating: reviewData.rating,
      title: reviewData.title.trim(),
      comment: reviewData.comment.trim(),
      pros: Array.isArray(reviewData.pros) ? reviewData.pros.filter(p => typeof p === 'string').slice(0, 5) : [],
      cons: Array.isArray(reviewData.cons) ? reviewData.cons.filter(c => typeof c === 'string').slice(0, 5) : [],
      id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString(),
      verified: false, // All new user reviews start as unverified
      withdrawalExperience: reviewData.withdrawalExperience,
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

  const getAverageWithdrawalTime = (brokerId: string): { averageDays: number | null; reportCount: number } => {
    const relevantReviews = reviews.filter(
        review => review.brokerId === brokerId && review.withdrawalExperience?.days !== undefined && review.withdrawalExperience.days >= 0
    );

    if (relevantReviews.length === 0) {
        return { averageDays: null, reportCount: 0 };
    }

    const totalDays = relevantReviews.reduce(
        (sum, review) => sum + (review.withdrawalExperience?.days || 0),
        0
    );

    const averageDays = totalDays / relevantReviews.length;
    return { averageDays: parseFloat(averageDays.toFixed(1)), reportCount: relevantReviews.length };
  };

  return (
    <ReviewsContext.Provider value={{ reviews, getReviewsByBrokerId, getReviewsByUserId, addReview, verifyReview, getAverageWithdrawalTime }}>
      {children}
    </ReviewsContext.Provider>
  );
};
