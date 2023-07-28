import React from 'react';
import { FaStar } from 'react-icons/fa';

interface Props {
  rating: number;
}

const StarRating: React.FC<Props> = ({ rating }) => {
  const roundedRating = Math.round(rating);

  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => (
        <span key={index}>
          {index < roundedRating ? (
            <FaStar />
          ) : (
            <FaStar style={{ opacity: 0.2 }} />
          )}
        </span>
      ))}
    </div>
  );
};

export default StarRating;
