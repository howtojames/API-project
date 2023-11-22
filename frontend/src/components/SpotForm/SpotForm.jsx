//import { useState, useEffect } from 'react';


//don't underestimate this forms practice
//it does seem easy, but will make makinf future forms much easier/faster
function SpotForm() {

    // //set state variables
    // const [name, setName] = useState('');
    // const [email, setEmail] = useState('');
    // const [phone, setPhone] = useState('');
    // const [phoneType, setPhoneType] = useState(''); //select
    // const [staff, setStaff] = useState('');  //radio
    // const [bio, setBio] = useState('');
    // const [signUp, setSignUp] = useState(false);

    // //set validationErrors and hasSubmitted
    // const [validationErrors, setValidationErrors] = useState({});
    // const [hasSubmitted, setHasSubmitted] = useState(false); //false when we log in

    // //use useEffect to setValidationErrors
    // useEffect(() => {
    //       //then we check for validationErrors
    //     //create error object
    //     const errors = {};
    //     //if length is 0
    //     if(!name.length) errors.name = 'Name field cannot be empty';
    //     if(!email.length) errors.email = 'Must have a valid email';
    //     if(!phone.length) errors.phone = 'Phone field cannot be empty';
    //     if(!phoneType.length) errors.phoneType = 'Please select a phone type';
    //     if(!staff.length) errors.staff = 'Please select a staff';
    //     //if(!bio.length) validationErrors.bio = 'Bio field cannot be empty';
    //     //Doesn't have to be every field

    //     setValidationErrors(errors);


    // }, [name, email, phone, phoneType, bio])


    // //the onSubmit funciton includes everything, other than useEffect
    // const onSubmit = (e) => {
    //     e.preventDefault();

    //     setHasSubmitted(true);  //we did submitted it first


    //     //has alert here, but don't really need

    //     //create formData and sendit
    //     const formData = {
    //         name,
    //         email,
    //         phone,
    //         phoneType,
    //         staff,
    //         bio,
    //         signUp
    //     }
    //     //console log it to see the info
    //     console.log('formData', formData);

    //     //reset all fields
    //     setName('');
    //     setEmail('');
    //     setPhone('');
    //     setPhoneType('');
    //     setStaff('');
    //     setBio('');
    //     setSignUp('');

    //     //reset validationErrors and hasSubmitted
    //     setValidatiionErorrs({});
    //     setHasSubmitted(false);
    // }

    // //track state change while typing
    // console.log(signUp);
    return (
        <form>
            <h2>Create a new Spot</h2>
            <div>
                <div>Where is your place located?</div>
                <div>Guests will only get your address once they booked a reservation.</div>
            </div>
            <div>
                <label>Country</label>
                <input type="text" />
            </div>
            <div>
                <label>Street Address</label>
                <input type="text" />
            </div>
            <div>
                <label>City</label>
                <input type="text" />
            </div>
            <div>
                <label>State</label>
                <input type="text" />
            </div>
            <div>
                <label>Describe your place to guests</label>
                <p></p>
                <textarea/>
            </div>


            <div>
                <label>Create a title for your Spot</label>
                <input type="text" />
            </div>
            <div>
                <label>Set a base price for your spot</label>
                <input type="text" />
            </div>
            <div>
                <label>Lineup your spot with photos</label>
                <input type="text" />
            </div>

            <button>Create a Spot</button>


        </form>
    )
}

export default SpotForm;
