// frontend/src/components/OpenModalButton/OpenModalButton.jsx
//phase 4

import { useModal } from '../../context/Modal';

//It should consume the setModalContent and setOnModalClose from the ModalContext.
//It should render a button that displays the buttonText as the text inside the button.
function OpenModalButton({
  modalComponent, // component to render inside the modal
  buttonText, // text of the button that opens the modal
  onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
  onModalClose // optional: callback function that will be called once the modal is closed
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onButtonClick === "function") onButtonClick();
  };

  return (
  <>

    <button onClick={onClick}>{buttonText}</button>
  </>);
}

export default OpenModalButton;

//note:
//explaintion of how to open modal is in phase 4

//As you may have already realized, you can use the OpenModalButton
//component for many different use cases!
//Yes, you can use it to render buttons that will trigger
//the login and signup forms as modals,
//but you could also use it anywhere in your application
//where you want to trigger the opening of a modal with the click of a button!
