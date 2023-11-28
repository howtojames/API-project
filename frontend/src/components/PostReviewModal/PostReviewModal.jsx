// PostReviewModal.jsx
//import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './PostReviewModal.css';

import StarsRatingInput from './StarsRatingInput';
import { useState } from 'react';

import { thunkGetReviewsBySpotId, thunkPostAReview, thunkGetReviewsCurrentUser} from '../../store/reviews';  //from reviews.js
import { thunkGetSpotDetails } from '../../store/spots';
//test
//import { thunkGetSpotDetails } from '../../store/spots';

//need to pass in reviewId
function PostReviewModal({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  //setting rating
  const [rating, setRating] = useState(0); /* review.rating */
  //for textarea
  const [review, setReview] = useState('');
  const [errors, setErrors] = useState('');

  const handleSubmit = async (e) => {
      //with preventDefault page refreshes and two of the same reviews are posted
      //without this it doesn't re-render and new review only pops up after refresh
      e.preventDefault();

      //create the data
      const post = {
          review: review,
          stars: rating    //keep it for setRating
      }

      //const reviewObj =
      await dispatch(thunkPostAReview(post, spotId))
      .catch(async (res) => {  //page does not reload with this .catch
        const data = await res.json();
        console.log('data', data);
        if (data && data.errors) {
          console.log('data.errors', data.errors);
          setErrors(data.errors);
        }
      });
      //If a server error occurs, show it below the title. (But that shouldn't happen under normal circumstances).

      //order matters!!!!!
      await dispatch(thunkGetReviewsCurrentUser());
      await dispatch(thunkGetReviewsBySpotId(spotId));
      await dispatch(thunkGetSpotDetails(spotId));

      closeModal();



      console.log('errors state', errors);
  };  //end of handleSubmit

  //setting rating
  const onChange = (number) => {
    setRating(parseInt(number));
  };

  return (
    <div className='post-review-modal-container'>
      <h3>How was your stay?</h3>
      {/* If a server error occurs, show it below the title. (But that shouldn't happen under normal circumstances). */}
      <div className="post-review-errors-container">
        {errors.review && <div className="post-review-errors">{errors.review}</div>}
        {errors.stars && <div className="post-review-errors">{errors.stars}</div>}
      </div>
      <form onSubmit={handleSubmit}>
        <textarea placeholder="Leave your review here..."
        onChange={(e)=> setReview(e.target.value)} value={review}></textarea>
        <div className='star-ratings-container'>
          <StarsRatingInput
            disabled={false}
            onChange={onChange}
            rating={rating}
          />
        </div>

        <button onClick={handleSubmit} className='submit-review-button'
        disabled={review.length < 10 || rating < 1}>Submit Your Review</button> {/* review.length > 10 for testing */}
      </form>
    </div>
  );
}

export default PostReviewModal;
