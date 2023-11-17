// frontend/src/context/Modal.jsx
// phase 4

import { useRef, useState, useContext, createContext } from 'react';
//added
import ReactDOM from 'react-dom';
//added
import './Modal.css';


const ModalContext = createContext();

export function ModalProvider({ children }) {
  const modalRef = useRef();
  //added
  const [modalContent, setModalContent] = useState(null);
  // callback function that will be called when modal is closing
  const [onModalClose, setOnModalClose] = useState(null);


  const closeModal = () => {
    setModalContent(null); // clear the modal contents
    // If callback function is truthy, call the callback function and reset it
    // to null:
    if (typeof onModalClose === "function") {
      setOnModalClose(null);
      onModalClose();
    }
  };

  //added
  const contextValue = {
    modalRef, // reference to modal div
    modalContent, // React component to render inside modal
    setModalContent, // function to set the React component to render inside modal
    setOnModalClose, // function to set the callback function to be called when modal is closing
    closeModal // added, function to close the modal
  };

  //added value props
  return (
    <>
      <ModalContext.Provider value={contextValue}>
        {children}
      </ModalContext.Provider>
      <div ref={modalRef} />
    </>
  );
}

//added in phase 4
//Modal component should consume the value of the ModalContext by using the useContext React hook.
//Extract the modalRef, modalContent, and the closeModal keys from the context value.
export function Modal() {
    const { modalRef, modalContent, closeModal } = useContext(ModalContext);
    // If there is no div referenced by the modalRef or modalContent is not a
    // truthy value, render nothing:
    if (!modalRef || !modalRef.current || !modalContent) return null;

    // Render the following component to the div referenced by the modalRef
    // these are arguments being passed in createPortal, this is now we create the modal
    return ReactDOM.createPortal(
      <div id="modal">
        <div id="modal-background" onClick={closeModal} />  {/* onClick, closes the modal */}
        <div id="modal-content">{modalContent}</div>
      </div>,
      modalRef.current     // reference to the actual HTML DOM element of the ModalProvider's div
    );
}

//added
export const useModal = () => useContext(ModalContext);
