// frontend/src/components/Navigation/OpenModalMenuItem.js
//added in phase bonus
import React from 'react';
import { useModal } from '../../context/Modal';

//The OpenModalMenuItem component code should look exactly like the OpenModalButton component code except:
//change the buttonText prop to itemText
//change the onButtonClick prop to onItemClick
function OpenModalMenuItem({
  modalComponent, // component to render inside the modal
  itemText, // text of the menu item that opens the modal
  onItemClick, // optional: callback function that will be called once the menu item that opens the modal is clicked
  onModalClose // optional: callback function that will be called once the modal is closed
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (onItemClick) onItemClick();
  };

  return (
    <li onClick={onClick}>{itemText}</li>
  );
}

export default OpenModalMenuItem;
