import React from "react";

function StoreMap() {
  // Specify the desired location
  //   const embeddedLocation = {
  //     lat: 40.7128, // Latitude of the location
  //     lng: -74.006, // Longitude of the location
  //   };

  return (
    <>
      {/* <LoadScript googleMapsApiKey="YOUR_API_KEY">
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={13}
          center={embeddedLocation}
        />
      </LoadScript> */}

      <section className="p-2 space-y-2 rounded-md bg-white shadow-md">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7722.346360333354!2d120.96923591578918!3d14.589205726278434!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397ca3d1375e1fb%3A0x49ebfa658c0ba08!2sIntramuros%2C%20Manila%2C%201002%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1708141259401!5m2!1sen!2sph"
          className="w-full h-50 md:h-80 lg:h-96 xl:h-80 2xl:h-96" // Responsive height
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
    </>
  );
}

export default StoreMap;
