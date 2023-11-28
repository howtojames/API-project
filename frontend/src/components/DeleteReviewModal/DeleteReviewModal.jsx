// from LoginFormModal

//import { useState } from 'react';
//import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './DeleteReviewModal.css';

import { thunkDeleteAReview } from '../../store/reviews';  //auto imported

//added to re-render
import { thunkGetReviewsBySpotId, thunkGetReviewsCurrentUser } from '../../store/reviews';
import { thunkGetSpotDetails } from '../../store/spots';


function DeleteReviewModal({ reviewId, spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

 const handleSubmit = async (e) => {
    // we want page to refresh/reload automatically
    e.preventDefault();

    await dispatch(thunkDeleteAReview(reviewId));

    //did the same in post review modal
    //re-renders after deleting a review from the details page
    await dispatch(thunkGetReviewsCurrentUser());  //used to calculate if user already posted a review, not needed but just to be safe
    await dispatch(thunkGetReviewsBySpotId(spotId));
    await dispatch(thunkGetSpotDetails(spotId));


    closeModal();

  };

  return (
    <div className='delete-review-modal-container'>
      <h3>Confirm Delete</h3>
      <p>Are you sure you want to delete this review?</p>
      <form onSubmit={handleSubmit}>
        <button onClick={handleSubmit}className='yes'>Yes (Delete Review)</button>
        <button onClick={closeModal} className='no'>No (Keep Review)</button> {/* works */}
      </form>
    </div>
  );
}

export default DeleteReviewModal;


//.then(closeModal)
// .catch(async (res) => {
//   const data = await res.json();
//   if (data && data.errors) {
//     //setErrors(data.errors);
//   }
// });
