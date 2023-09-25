// frontend/src/components/OpenModalMenuItem/index.js
import React from "react";
import { useModal } from "../../context/Modal";

//Create and export a functional component called OpenModalButton that takes in 4 props:
function OpenModalMenuItem({
  modalComponent, // component to render inside the modal once the button is clicked
  buttonText, // text of the button that triggers the modal to open
  onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
  onModalClose, // optional: callback function that will be called once the modal is closed
}) {
  //It should consume the setModalContent and setOnModalClose from the ModalContext
  const { setModalContent, setOnModalClose } = useModal(); //ModalContext

  //When the button is clicked, it should:
  const onClick = () => {
    //Invoke onButtonClick if onButtonClick is a function
    if (typeof onButtonClick === "function") onButtonClick();
    //Invoke setOnModalClose with onModalClose only if onModalClose is a function
    if (typeof onModalClose === "function") setOnModalClose(onModalClose);
    //Open the modal with the modalComponent as the content of the modal by invoking setModalContent with modalComponent
    setModalContent(modalComponent);
  };

  //It should render a button that displays the buttonText as the text inside the button.
  return <button onClick={onClick}>{buttonText}</button>;
}

export default OpenModalMenuItem;


// Examples of how to use the OpenModalButton
// Let's say you want to render a popup modal text of "Hello World!" when a button with the text of "Greeting" is clicked. You can use the OpenModalButton to create a component which renders this button that triggers this modal.

// Here's an example of one such component:

// const Greeting = () => {
//   return (
//     <OpenModalButton
//       buttonText="Greeting"
//       modalComponent={<h2>Hello World!</h2>}
//     />
//   );
// };
// Let's say you want to print "Greeting initiated" in the console logs whenever the "Greeting" button is clicked. You could add the following callback function as the onButtonClick prop to the OpenModalButton component:

// const Greeting = () => {
//   return (
//     <OpenModalButton
//       buttonText="Greeting"
//       modalComponent={<h2>Hello World!</h2>}
//       onButtonClick={() => console.log("Greeting initiated")}
//     />
//   );
// };
// Now, let's say you wanted to print "Greeting completed" in the console logs whenever the user closes the "Hello World!" modal. You could add the following callback function as the onModalClose prop to the OpenModalButton component:

// const Greeting = () => {
//   return (
//     <OpenModalButton
//       buttonText="Greeting"
//       modalComponent={<h2>Hello World!</h2>}
//       onButtonClick={() => console.log("Greeting initiated")}
//       onModalClose={() => console.log("Greeting completed")}
//     />
//   );
// };
// The Greeting component will render a button element that, when clicked, will trigger a modal with an h2 element of "Hello World!" and will print "Greeting initiated" to the console logs. When the modal is closed, it will print "Greeting completed" to the console logs.

// If you have already observed, you can use the OpenModalButton component for many different use cases! You can use it to render buttons trigger the login and sign up forms as modals, but you could use it anywhere in your application where you want to trigger a modal to open by the click of a button!
