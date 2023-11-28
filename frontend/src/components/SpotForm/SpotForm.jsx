import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SpotForm.css';

import { thunkPostASpot, thunkPostASpotImage } from '../../store/spots';  //auto imported
import { useDispatch } from 'react-redux';

//don't underestimate this forms practice
//it does seem easy, but will make makinf future forms much easier/faster
function SpotForm() {

    // set state variables for Form input
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');

    //placeholder values, not required for proejct
    const lat = 37.7645358;
    const lng = -122.4730327;

    const [description, setDescription] = useState('');
    //title in frontend, name in backend
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');  //use undefined, null will show a warning message

    const [previewImg, setPreviewImg] = useState('');
    const [imgUrl2, setImgUrl2] = useState('');
    const [imgUrl3, setImgUrl3] = useState('');
    const [imgUrl4, setImgUrl4] = useState('');
    const [imgUrl5, setImgUrl5] = useState('');

    //validation errrors default to empty object
    const [validationErrors, setValidationErrors] = useState({});
    //hasSubmitted is false when we log in / visit the page
    const [hasSubmitted, setHasSubmitted] = useState(false);

    //console.log('top validationErrors', validationErrors);
    //console.log('top hasSubmitted', hasSubmitted);

    const navigate = useNavigate();

    // // useEffect to check and setValidationErrors
    // this is ran after the first render
    // validationErrors should change anytime a change is made to the values
    useEffect(() => {
        //console.log('inside error validation')
        //create error object
        const errors = {};
        //if length is 0
        if(!country.length) errors.country = 'Country is required';
        if(!address.length) errors.address = 'Address is required';
        if(!city.length) errors.city = 'City is required';
        if(!state.length) errors.state = 'State is requried';

        //Description needs a minimum of 30 characters.
        if(description.length < 30) errors.description = 'Description needs a minimum of 30 characters';

        if(!name.length) errors.name = 'Name is required';
        //number input
        if (price === null || price === undefined || price === 0 || price.length === 0) errors.price = 'Price is required';

        //Image Url check
        //this logic will first check if the url exists, if it does, then checks for the format
        if(previewImg.length === 0) errors.previewImg = 'Preview image is required';
        //if it does exists and does not end with the formats
        else if(!previewImg.endsWith('.jpg') && !previewImg.endsWith('.jpeg') && !previewImg.endsWith('.png')) errors.previewImg = 'Image URL must end in .png .jpg or .jpeg';
        //if it exists first, and it does not end with .jpg and does not ends iwth jpeg and does not end with .png
        if(imgUrl2 && !imgUrl2.endsWith('.jpg') && !imgUrl2.endsWith('.jpeg') && !imgUrl2.endsWith('.png')) errors.imgUrl2 = 'Image URL must end in .png .jpg or .jpeg';
        if(imgUrl3 && !imgUrl3.endsWith('.jpg') && !imgUrl3.endsWith('.jpeg') && !imgUrl3.endsWith('.png')) errors.imgUrl3 = 'Image URL must end in .png .jpg or .jpeg';
        if(imgUrl4 && !imgUrl4.endsWith('.jpg') && !imgUrl4.endsWith('.jpeg') && !imgUrl4.endsWith('.png')) errors.imgUrl4 = 'Image URL must end in .png .jpg or .jpeg';
        if(imgUrl5 && !imgUrl5.endsWith('.jpg') && !imgUrl5.endsWith('.jpeg') && !imgUrl5.endsWith('.png')) errors.imgUrl5 = 'Image URL must end in .png .jpg or .jpeg';

        //console.log('errors', errors);
        //set state to errors object
        setValidationErrors(errors);
        //console.log('afer setValidationErrors', validationErrors);

    }, [hasSubmitted, country, address, city, state, description, name, price, previewImg, imgUrl2, imgUrl3, imgUrl4, imgUrl5]);
    // remember to include hasSubmitted, because when we set it to true/submitted it, we want to check and popualte the errors again

    const dispatch = useDispatch();

    // //the onSubmit funciton includes everything, other than useEffect
    const onSubmit = async (e) => {
        console.log('inside onSubmit function')
        e.preventDefault();  //prevent reloading

        //usual order
        setHasSubmitted(true);
        console.log('hasSubmitted', hasSubmitted);

        const newSpotData = {
            address,
            city,
            state,
            country,
            lat,          //constant values, only do if you have time later
            lng,
            name,
            description,
            price,
            //previewImg,
            //imgUrl2,
            //imgUrl3,
            //imgUrl4,
            //imgUrl5
        };
        console.log('newSpotData', newSpotData);
        //await dispatch thunk here



        //if we pass the frontend validatoions
        //we send the data,
        //and reset the errors, hasSubmitted
        if(Object.values(validationErrors).length === 0){
            const spotResObj = await dispatch(thunkPostASpot(newSpotData));
            console.log('spotResObj', spotResObj);
            console.log('spotResObj.id', spotResObj.id);
            if(spotResObj.errors){
                console.log('spotResObj.errors', spotResObj.errors);
                console.log('backend error validation failed, onSubmit failed')
            }

            //since create new spot works, we add teh image using the :spotId
            if(previewImg) { //empty '' is falsey, '.jpg' is truthy
                let spotImgResObj = await dispatch(thunkPostASpotImage(spotResObj.id, { url: previewImg, preview: true }));
                console.log('spotImgResObj', spotImgResObj);
            }
            if(imgUrl2) {
                let spotImgResObj = await dispatch(thunkPostASpotImage(spotResObj.id, { url: imgUrl2, preview: false }));
                console.log('spotImgResObj', spotImgResObj);
            }
            if(imgUrl3) {
                let spotImgResObj = await dispatch(thunkPostASpotImage(spotResObj.id, { url: imgUrl3, preview: false }));
                console.log('spotImgResObj', spotImgResObj);
            }
            if(imgUrl4) {
                let spotImgResObj = await dispatch(thunkPostASpotImage(spotResObj.id, { url: imgUrl4, preview: false }));
                console.log('spotImgResObj', spotImgResObj);
            }
            if(imgUrl5) {
                let spotImgResObj = await dispatch(thunkPostASpotImage(spotResObj.id, { url: imgUrl5, preview: false }));
                console.log('spotImgResObj', spotImgResObj);
            }


            //we only reset if form submission is sucessful
            //reset all fields to default values
            setCountry('');
            setAddress('');
            setCity('');
            setState('');
            setDescription('');
            setName('');
            setPrice('');  //unsure
            setPreviewImg('');
            setImgUrl2('');
            setImgUrl3('');
            setImgUrl4('');
            setImgUrl5('');

            // //reset validationErrors to empty object and hasSubmitted to false
            setValidationErrors({});
            setHasSubmitted(false);

            //navigate to
            navigate(`/spots/${spotResObj.id}`);
        }

        //this is the response we get back from the backend
        //Errors are handled in the frontend, but if this line of defense doesn't work
        //we check errors from the backend


        //if there are validatoin errors we prevent from submitting
        // if(Object.values(validationErrors).length > 0) {
        //     console.log('validationErrors exist, onSubmit failed');

        // }

        //console.log('form successfully submitted')
    }

    // //track state change while typing
    // console.log(signUp);
    //we change all labels to div because we want them to be vertical

    console.log('before render hasSubmitted', hasSubmitted);
    console.log('before render validationErrors', validationErrors);
    return (
        <form onSubmit={onSubmit} className="spot-form">
            <h2>Create a new Spot</h2>
            <section className="section-one">
                <div>
                    <div className="section-header">Where is your place located?</div>
                    <div className="form-description">Guests will only get your address once they booked a reservation.</div>
                </div>
                <div>
                    <div>Country {"country" in validationErrors && hasSubmitted && <span className='error-message'>{validationErrors.country}</span>}</div>
                    <input type="text" placeholder="Country" className="full-length-text-input"
                        onChange={(e) => setCountry(e.target.value)}
                        value={country}
                    />

                </div>
                <div>
                    <div>Street Address {"address" in validationErrors && hasSubmitted && <span className='error-message'>{validationErrors.address}</span>}</div>
                    <input type="text" placeholder="Address" className="full-length-text-input"
                         onChange={(e) => setAddress(e.target.value)}
                         value={address}/>

                </div>
                <div id='city-state-conatiner'>
                    <div className="city">
                        <div id="city">City {"city" in validationErrors && hasSubmitted && <span className='error-message'>{validationErrors.city}</span>}</div>
                        <input type="text" placeholder="City"
                            onChange={(e) => setCity(e.target.value)}
                            value={city}/>
                        <span className='comma'>,</span>  {/* this has to be inline */}
                    </div>
                    <div className="state">
                        <div >State {"state" in validationErrors && hasSubmitted && <span className='error-message'>{validationErrors.state}</span>}</div>
                        <input type="text" placeholder="STATE"
                            onChange={(e) => setState(e.target.value)}
                            value={state}/>
                    </div>
                </div>
            </section>

            <section className="section-two">
                <div>
                    <div className="section-header">Describe your place to guests</div>
                    <div className="form-description">Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</div>
                    <textarea placeholder="Please write at least 30 characters"
                     onChange={(e) => setDescription(e.target.value)}
                     value={description}/>
                    {"description" in validationErrors && hasSubmitted && <span className='error-message'>{validationErrors.description}</span>}
                </div>
            </section>

            <section className="section-three">
                <div>
                    <div className="section-header">Create a title for your Spot</div>
                    <div>Catch guests&apos; attention with a spot title that highlights what makes your place special.</div>
                    <input type="text" placeholder="Name of your spot" className="full-length-text-input"
                     onChange={(e) => setName(e.target.value)}
                     value={name}/>
                    {"name" in validationErrors && hasSubmitted && <span className='error-message'>{validationErrors.name}</span>}
                </div>
            </section>

            <section className="section-four">
                <div className="section-header">Set a base price for your spot</div>
                <div>Competitive pricing can help your listing stand out and rank higher in search results.</div>
                <div className="price-input-container">
                    <div>$&nbsp;</div>
                    <input type='number' placeholder='Price per night (USD)' className="price-input"
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}/>
                 </div>
                {"price" in validationErrors && hasSubmitted && <span className='error-message'>{validationErrors.price}</span>}
            </section>

            <section className="section-five">
                    <div className="section-header">Liven up your spot with photos</div>
                    <div>Submit a link to at least one photo to publish your spot.</div>
                    <input type="text" placeholder="Preview Image URL" className="full-length-text-input"
                        onChange={(e) => setPreviewImg(e.target.value)}
                        value={previewImg}/>
                    {/* contition for displaying blank space or error message */}
                    {("previewImg" in validationErrors && hasSubmitted) ? (
                    <span className='error-message'>{validationErrors.previewImg}</span>) : (<div><br /></div>)}
                    <input type="text" placeholder="Image URL" className="full-length-text-input"
                        onChange={(e) => setImgUrl2(e.target.value)}
                        value={imgUrl2}/>
                    {("imgUrl2" in validationErrors && hasSubmitted) ? (
                    <span className='error-message'>{validationErrors.imgUrl2}</span>) : (<div><br /></div>)}
                    <input type="text" placeholder="Image URL" className="full-length-text-input"
                        onChange={(e) => setImgUrl3(e.target.value)}
                        value={imgUrl3}/>
                     {("imgUrl3" in validationErrors && hasSubmitted) ? (
                    <span className='error-message'>{validationErrors.imgUrl3}</span>) : (<div><br /></div>)}
                    <input type="text" placeholder="Image URL" className="full-length-text-input"
                        onChange={(e) => setImgUrl4(e.target.value)}
                        value={imgUrl4}/>
                     {("imgUrl4" in validationErrors && hasSubmitted) ? (
                    <span className='error-message'>{validationErrors.imgUrl4}</span>) : (<div><br /></div>)}
                    <input type="text" placeholder="Image URL" className="full-length-text-input"
                        onChange={(e) => setImgUrl5(e.target.value)}
                        value={imgUrl5}/>
                      {("imgUrl5" in validationErrors && hasSubmitted) ? (
                    <span className='error-message'>{validationErrors.imgUrl5}</span>) : (<div><br /></div>)}
            </section>

            {/* onSubmit handled in form element */}
            <section className="section-six">
                <button type="submit">Create Spot</button>
                </section>

        </form>
    )
}

export default SpotForm;
