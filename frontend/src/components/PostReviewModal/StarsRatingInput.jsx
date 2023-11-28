import { useState } from 'react';
import './PostReviewModal.css';


const StarsRatingInput = ({ rating, disabled, onChange }) => {
  const [activeRating, setActiveRating] = useState(rating);

  // useEffect(() => {
  //   setActiveRating(rating);
  // }, [rating]);
  // NOTE: This useEffect isn't necessary to have for this scenario anymore
  // because the number input has been removed, but if you have a scenario which
  // requires this input to be re-rendered with an updated rating prop instead
  // of unmounted and remounted with an updated rating, then this useEffect is
  // necessary.

  return (
    <>

        {/* changed the divs to i, put the conditional inside the className */}
        <div className="rating-input">
        <i
            className={activeRating >= 1 ? "fa-solid fa-star" : "fa-regular fa-star"}
            onMouseEnter={() => { if (!disabled) setActiveRating(1)} }
            onMouseLeave={() => { if (!disabled) setActiveRating(rating)} }
            onClick={() => { if (!disabled) onChange(1)} }
        >
        </i>
        <i
            className={activeRating >= 2 ? "fa-solid fa-star" : "fa-regular fa-star"}
            onMouseEnter={() => { if (!disabled) setActiveRating(2)} }
            onMouseLeave={() => { if (!disabled) setActiveRating(rating)} }
            onClick={() => { if (!disabled) onChange(2)} }
        >
        </i>
        <i
            className={activeRating >= 3 ? "fa-solid fa-star" : "fa-regular fa-star"}
            onMouseEnter={() => { if (!disabled) setActiveRating(3)} }
            onMouseLeave={() => { if (!disabled) setActiveRating(rating)} }
            onClick={() => { if (!disabled) onChange(3)} }
        >
        </i>
        <i
            className={activeRating >= 4 ? "fa-solid fa-star" : "fa-regular fa-star"}
            onMouseEnter={() => { if (!disabled) setActiveRating(4)} }
            onMouseLeave={() => { if (!disabled) setActiveRating(rating)} }
            onClick={() => { if (!disabled) onChange(4)} }
        >
        </i>
        <i
            className={activeRating >= 5 ? "fa-solid fa-star" : "fa-regular fa-star"}
            onMouseEnter={() => { if (!disabled) setActiveRating(5) }}
            onMouseLeave={() => { if (!disabled) setActiveRating(rating)} }
            onClick={() => { if (!disabled) onChange(5)} }
        >
        </i>
        <div className="stars-text">Stars</div>
        </div>
    </>
  );
};

export default StarsRatingInput;


/* {<input
    type="number"
    disabled={disabled}
    value={activeRating}
    onChange={(e) => setActiveRating(e.target.value)}
/>} */
