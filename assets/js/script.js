// for when you click the category buttons it would change the appropriate state to true
var action = false;
var comedy = false;
var romance = false;
var drama = false;
var sci = false;
var horror = false;

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



var zomatoApiKey = "8ad7cae02b2d6a7122357d5b80d69935";
$.ajax({
  "url": "https://developers.zomato.com/api/v2.1/geocode?lat=-37.971237&lon=144.4926845&apikey=" + zomatoApiKey,
  "method": "GET",
  "success": function(response) {
    var restaurants = response.nearby_restaurants;
    for (var i = 0; i < restaurants.length; i++) {
      console.log(restaurants[i].restaurant.name);
    }
  }
})

function getGeoLocations() {

  if ('geolocation' in navigator) {
    
    // set latitude to correct state  
    latitude = 'undefined';


    navigator.geolocation.getCurrentPosition((position) => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
    });


    if ((latitude !== parseInt(latitude, 10)) && (latitude !== 'undefined')) {


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



var apiTicketmaster = "2fd4BLBJMbQOCZ46tstmLFQbHrYGeXCs";
var ticketMasterURL = "https://app.ticketmaster.com/discovery/v2/events.json?size=1&apikey=" + apiTicketmaster;

console.log(ticketMasterURL)

$.ajax({
  type:"GET",
  url:ticketMasterURL,
  async:true,
  dataType: "json",
  success: function(json) {
              console.log(json);
            
           },
  error: function(xhr, status, err) {
              // This time, we do not end up here!
           }
});