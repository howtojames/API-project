// from LoginFormModal

//import { useState } from 'react';
//import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './DeleteSpotModal.css';

import { thunkDeleteASpot } from '../../store/spots';

import { thunkGetCurrentUserSpots } from '../../store/spots';


function DeleteSpotModal({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

 const handleSubmit = async (e) => {
    // we want page to refresh/reload automatically
    e.preventDefault();

    await dispatch(thunkDeleteASpot(spotId))
    //add this to re-render the data on "Manage your spots page"
    await dispatch(thunkGetCurrentUserSpots());
    closeModal();

      // .then(closeModal)
      // .catch(async (res) => {
      //   const data = await res.json();
      //   if (data && data.errors) {
      //     //setErrors(data.errors);
      //   }
      // });
  };

  return (
    <div className='delete-spot-modal-container'>
      <h3>Confirm Delete</h3>
      <p>Are you sure you want to remove this spot?</p>
      <form onSubmit={handleSubmit}>
        <button onClick={handleSubmit} id='yes'>Yes (Delete Spot)</button>
        <button onClick={closeModal} id='no'>No (Keep Spot)</button> {/* works */}
      </form>
    </div>
  );
}

export default DeleteSpotModal;
