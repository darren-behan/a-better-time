// for when you click the category buttons it would change the appropriate state to true
var action = false;
var comedy = false;
var romance = false;
var drama = false;
var sci = false;
var horror = false;
var latitude = 'undefined';
var longitude = 'undefined';

$(document).ready(function () {
  // stay in button start page
  $(".initBtnOne").on("click", function () {
    setInterval(function () {
      $(".container").fadeOut("slow");
      setInterval(function () {
        $(".contain").css("display", "block");
        $(".results").css("display", "block");
      }, 1000);
    }, 500);
  });

  // category selection
  $(".cat").on("click", function () {
    $(this).css("box-shadow", "inset 4px 4px 4px rgba(0, 0, 0, 0.25)");
    $(this).css("background-color", "#757575");
  });

  function zaMato(lat, lon) {
    console.log(lat, lon);

    var settings = {
      url:
        "https://developers.zomato.com/api/v2.1/geocode?lat=" +
        lat +
        "&lon=" +
        lon +
        "&count=5",
      method: "GET",
      timeout: 0,
      headers: {
        Accept: "application/json",
        "user-key": "8ad7cae02b2d6a7122357d5b80d69935",
      },
    };

    $.ajax(settings).done(function (response) {
      console.log(response);
    });
  }

  function getGeoLocations(requestType) {
    if ("geolocation" in navigator) {
     
      navigator.geolocation.getCurrentPosition((position) => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        });
    }  
       
    if (latitude !== parseInt(latitude, 10) || latitude === "undefined") {
        // the call failed - use the IP address

        $.ajax("http://ip-api.com/json").then(
          function success(response) {
            latitude = response.lat;
            longitude = response.lon;
            console.log("lat " + latitude + " long + :" + longitude);
           
          },

          function fail(data, status) {
            // If this fails, we need to get the users ip address to find location settings.
            //console.log("Request failed.  Returned status of", status);
          }
        );
      }  
  }

  // this needs to be run straight away to assign the variables.
  getGeoLocations();



  function ticketMaster() {
    var apiTicketmaster = "2fd4BLBJMbQOCZ46tstmLFQbHrYGeXCs";
    var ticketMasterURL =
      "https://app.ticketmaster.com/discovery/v2/events.json?size=1&apikey=" +
      apiTicketmaster;

    console.log(ticketMasterURL);

    $.ajax({
      type: "GET",
      url: ticketMasterURL,
      async: true,
      dataType: "json",
      success: function (json) {
        console.log(json);
      },
      error: function (xhr, status, err) {
        // This time, we do not end up here!
      },
    });
  }

  moviesGlu();


  function moviesGlu() {
    var settings = {
      url: "https://api-gate2.movieglu.com/cinemasNearby/?n=5",
      method: "GET",
      timeout: 0,
      headers: {
        "api-version": "v200",
        Authorization: "Basic A1B2c3D4E5f6H7I8j911M12=",
        client: "ABCD",
        "x-api-key": "W9UumBbfdk3conyLM2I4H2eQdH21OcHG2msJYtLK",
        "device-datetime": "2020-06-20T19:28:00.296Z",
        territory: "AU",
      },
    };

    $.ajax(settings).done(function (response) {
      console.log(response);
    });
  }
});
