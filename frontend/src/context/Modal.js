// frontend/src/context/Modal.js
//phase 4
//changed again later
import React, { useRef, useState, useContext } from "react";
//phase 4
import ReactDOM from "react-dom";
//phase 4
import "./Modal.css";



//Create a React context called a ModalContext.
const ModalContext = React.createContext();


//Create and export a functional component called ModalProvider that renders the
// ModalContext.Provider component with all the children from the props as a child.
// without default - its a named export
export function ModalProvider({ children }) {
  //modalRef using the useRef React hook
  //references an html eement
  //modalRef.current will be set to the actual HTML DOM element that gets rendered from the div
  const modalRef = useRef();
  const [modalContent, setModalContent] = useState(null); //added
  // callback function that will be called when modal is closing
  const [onModalClose, setOnModalClose] = useState(null);

  //Create a function called closeModal
  const closeModal = () => {
    setModalContent(null); // clear the modal contents
    // If callback function is truthy, call the callback function and reset it
    // to null:
    if (typeof onModalClose === "function") {
      setOnModalClose(null);
      onModalClose();
    }
  };

  //create an object literal as a dynamic context value and add the modalRef as a key-value pair
  //Pass the dynamic context value into the ModalContext.Provider as the value prop (in the JSX)
  const contextValue = {
    modalRef, // reference to modal div
    modalContent, // React component to render inside modal, added
    setModalContent, // function to set the React component to render inside modal
    setOnModalClose, // function to set the callback function to be called when modal is closing
    closeModal, // function to close the modal
  }; //pass in the context to the provider

  //Render a div element as a sibling and right after the ModalContext.Provider.
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
export function Modal() {
    // Modal component should consume the value of the ModalContext by using the useContext React hook. Extract the modalRef, modalContent, and the closeModal keys from the context value.
    const { modalRef, modalContent, closeModal } = useContext(ModalContext);
    // If there is no div referenced by the modalRef or modalContent is not a
    // truthy value, render nothing:
    if (!modalRef || !modalRef.current || !modalContent) return null;

    // Render the following component to the div referenced by the modalRef
    // render a div with an id of modal
    //a div with an id of modal-background
    //another div with an id of modal-content
    // 2. Add an onClick listener to the modal-background so that when it is clicked, the closeModal function should be invoked.
    return ReactDOM.createPortal(
      <div id="modal">
        <div id="modal-background" onClick={closeModal} />
        <div id="modal-content">{modalContent}</div>
      </div>,
      modalRef.current
    );
  }

//phase 4
//Create and export as a named export a custom React hook called useModal
//that can be used by React components to easily consume the ModalContext.
export const useModal = () => useContext(ModalContext);
