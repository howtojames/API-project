// from LoginFormModal

//import { useState } from 'react';
//import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './DeleteSpotModal.css';

import { thunkDeleteASpot } from '../../store/spots';

function DeleteSpotModal({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

 const handleSubmit = () => {
    // we want page to refresh/reload automatically
    // e.preventDefault();

    return dispatch(thunkDeleteASpot(spotId))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          //setErrors(data.errors);
        }
      });
  };

  return (
    <div className='delete-spot-modal-container'>
      <h3>Confirm Delete</h3>
      <p>Are you sure you want to remove this spot?</p>
      <form onSubmit={handleSubmit}>
        <button onClick={handleSubmit}className='yes'>Yes (Delete Spot)</button>
        <button onClick={closeModal} className='no'>No (Keep Spot)</button> {/* works */}
      </form>
    </div>
  );
}

export default DeleteSpotModal;
