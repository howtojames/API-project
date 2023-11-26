import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SpotFormUpdate.css';

import { thunkGetSpotDetails, thunkUpdateASpot } from '../../store/spots';  //auto imported
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';


//don't underestimate this forms practice
//it does seem easy, but will make makinf future forms much easier/faster
function SpotFormUpdate() {
    const dispatch = useDispatch();

    let { id } = useParams();
    id = parseInt(id);


    // populate the state variables to the data passed back
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');

    //placeholder values, not required for project
    const lat = 37.7645358;
    const lng = -122.4730327;

    const [description, setDescription] = useState('');
    //title in frontend, name in backend
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');  //use undefined, null will show a warning message

    //validation errrors default to empty object
    const [validationErrors, setValidationErrors] = useState({});
    //hasSubmitted is false when we log in / visit the page
    const [hasSubmitted, setHasSubmitted] = useState(false);

    //dispatch only in useEffect, and when the id in the url changes
    useEffect(() => {
        dispatch(thunkGetSpotDetails(id));
    }, [dispatch, id]);

    //populate the values from the store
    const spotDataObj = useSelector(state => state.spots[id]);  //access using computed value
    console.log('useSelector spotData', spotDataObj);

    //only runs before first render
    useEffect(() => {
        console.log('inside', spotDataObj);
        //add check here, its the only way TODO:::
        if(spotDataObj) {
            setCountry(spotDataObj.country);
            setAddress(spotDataObj.address);
            setCity(spotDataObj.city);
            setState(spotDataObj.state);
            setDescription(spotDataObj.description);
            setName(spotDataObj.name);
            setPrice(spotDataObj.price);
        }
    }, [spotDataObj]);
    //runs before first render and everytime state is changed
    //even after a reload without submission, the page will retain data, and will not throw error


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


        //console.log('errors', errors);
        //set state to errors object
        setValidationErrors(errors);
        //console.log('afer setValidationErrors', validationErrors);

    }, [hasSubmitted, country, address, city, state, description, name, price]);
    // remember to include hasSubmitted, because when we set it to true/submitted it, we want to check and popualte the errors again



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
        };
        console.log('newSpotData', newSpotData);
        //await dispatch thunk here



        //if we pass the frontend validatoions
        //we send the data,
        //and reset the errors, hasSubmitted
        if(Object.values(validationErrors).length === 0){
            //thunkUpdateASpot takes in (spotId, spot)
            const spotResObj = await dispatch(thunkUpdateASpot(id, newSpotData));
            console.log('spotResObj', spotResObj);
            console.log('spotResObj.id', spotResObj.id);
            if(spotResObj.errors){
                console.log('spotResObj.errors', spotResObj.errors);
                console.log('backend error validation failed, onSubmit failed')
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

            //reset validationErrors to empty object and hasSubmitted to false
            setValidationErrors({});
            setHasSubmitted(false);

            //navigate to
            navigate(`/spots/${spotResObj.id}`);
        }

    }//end of onSubmit

    console.log('before render hasSubmitted', hasSubmitted);
    console.log('before render validationErrors', validationErrors);
    return (
        <form onSubmit={onSubmit} className="spot-form">
            <h2>Update your Spot</h2>
            <section className="section-one">
                <div>
                    <div className="section-header">Where is your place located?</div>
                    <p>Guests will only get your address once they booked a reservation.</p>
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
                <div className='city-state-conatiner'>
                    <div className="city">
                        <div >City {"city" in validationErrors && hasSubmitted && <span className='error-message'>{validationErrors.city}</span>}</div>
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
                    <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
                    <textarea placeholder="Please write at least 30 characters"
                     onChange={(e) => setDescription(e.target.value)}
                     value={description}/>
                    {"description" in validationErrors && hasSubmitted && <span className='error-message'>{validationErrors.description}</span>}
                </div>
            </section>

            <section className="section-three">
                <div>
                    <div className="section-header">Create a title for your Spot</div>
                    <p>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
                    <input type="text" placeholder="Name of your spot" className="full-length-text-input"
                     onChange={(e) => setName(e.target.value)}
                     value={name}/>
                    {"name" in validationErrors && hasSubmitted && <span className='error-message'>{validationErrors.name}</span>}
                </div>
            </section>

            <section className="section-four">
                <div className="section-header">Set a base price for your spot</div>
                <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                <div className="price-input-container">
                    <div>$&nbsp;</div>
                    <input type='number' placeholder='Price per night (USD)' className="price-input"
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}/>
                 </div>
                {"price" in validationErrors && hasSubmitted && <span className='error-message'>{validationErrors.price}</span>}
            </section>

            {/* No images in update */}

            {/* onSubmit handled in form element */}
            <section className="section-six">
                <button type="submit">Update your Spot</button>
                </section>

        </form>
    )
}

export default SpotFormUpdate;
