// from LoginFormModal

//import { useState } from 'react';
//import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './DeleteReviewModal.css';

import { thunkDeleteAReview } from '../../store/reviews';  //auto imported


function DeleteReviewModal({ reviewId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

 const handleSubmit = () => {
    // we want page to refresh/reload automatically
    // e.preventDefault();

    return dispatch(thunkDeleteAReview(reviewId))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          //setErrors(data.errors);
        }
      });
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
