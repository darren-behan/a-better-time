// for when you click the category buttons it would change the appropriate state to true
var action = false;
var comedy = false;
var romance = false;
var drama = false;
var sci = false;
var horror = false;
var latitude;
var longitude;


// stay in button start page
$(".initBtnOne").on("click", function () {
  setInterval(function () {
    $(".container").fadeOut("slow");
    setInterval(function () {
      $(".contain").css("display", "block")
      $(".results").css("display", "block")
    }, 1000);
  }, 500);
})

// $(".initBtnTwo").on("click", function () {
//   setInterval(function () {
//     $(".container").fadeOut("slow");
//     setInterval(function () {
//       $(".contain").css("display", "block")
//     }, 1000);
//   }, 500);
// })

// category selection
$(".cat").on("click", function () {
  $(this).css("box-shadow", "inset 4px 4px 4px rgba(0, 0, 0, 0.25)")
  $(this).css("background-color", "#757575")
})


// in order for zoomato to work correctly, a location ID must be provided.
// this id is based on the user latx - laty location settings under geocoding.
// first function will be to get the users ID 


function getGeoLocations() {

  if ('geolocation' in navigator) {
    /* geolocation is available */

    console.log("I am succesful");


    navigator.geolocation.getCurrentPosition((position) => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
    });


    if (latitude !== parseInt(latitude, 10)) {


      // the call failed - use the IP address
      console.log("the call failed");
      $.ajax('http://ip-api.com/json')
        .then(
          function success(response) {
            console.log(response);


            latitude = response.lat;
            longitude = response.lon;
            console.log("lat " + latitude + " long + :" + longitude);

          },

          function fail(data, status) {
            // If this fails, we need to get the users ip address to find location settings.
            console.log('Request failed.  Returned status of',
              status);
          }
        );

    }
  }
}







getGeoLocations();

