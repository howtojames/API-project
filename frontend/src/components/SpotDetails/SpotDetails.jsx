import { useParams } from 'react-router-dom';


function SpotDetails() {

    const { spotId } = useParams();

    // const spot = galleries.find(((gallery) => gallery.galleryid === parseInt(galleryId)));  //originally from GalleryView, but still works

    // const artObject = gallery.objects.find((artwork) => {

    // return artwork.id === parseInt(artId)});

    // const backToHomePage = () => {
    //     navigate(`/`);
    // };

    console.log('spotId', spotId);
    return (
        <>
            <h1>SpotDetails Component</h1>
        </>
    )
}

export default SpotDetails;
