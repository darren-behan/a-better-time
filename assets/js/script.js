// Co-ordinates variables
var latitude = 'undefined';
var longitude = 'undefined';

// Category variables(RE)
var outdoors = false;
var events = false;
var food = true;
var movies = true;
var cost = "";
var loc = "";
var time = "";
var apis = ['zamato','ticketmaster','trips','internal'];



$(document).ready(function() {

  // First page button - Day(RE)
  $(".initBtnOne").on("click", function () {
    setInterval(function () {
      $(".container").fadeOut("slow");
      setInterval(function () {
        $(".navbar").css("visibility", "visible")
        $(".contain").css("display", "block")
        $(".results").css("display", "flex")
        $(".header").css("display", "block")
      }, 1000);
    }, 500);
  });
  
  // First page button - Night(RE)
  $(".initBtnTwo").on("click", function () {
    setInterval(function () {
      $(".container").fadeOut("slow");
      setInterval(function () {
        $(".navbar").css("visibility", "visible")
        $(".contain").css("display", "block")
        $(".results").css("display", "flex")
        $(".header").css("display", "block")
      }, 1000);
    }, 500);
  });

  // Category selection when using filter dropdown(RE)
  $(".cat").on("click", function () {
    $(this).css("box-shadow", "inset 4px 4px 4px rgba(0, 0, 0, 0.25)")
    $(this).css("background-color", "#757575")
    console.log($(this).text());
    event.stopPropagation();
  });

  $(".cost").on("click", function() {
    $(this).css("box-shadow", "inset 4px 4px 4px rgba(0, 0, 0, 0.25)")
    cost = $(this).text();
    console.log($(this).text());
    event.stopPropagation();
  });

  $(".loc").on("click", function() {
    $(this).css("box-shadow", "inset 4px 4px 4px rgba(0, 0, 0, 0.25)")
    loc = $(this).text();
    console.log($(this).text());
    event.stopPropagation();
  });

  $(".time").on("click", function() {
    $(this).css("box-shadow", "inset 4px 4px 4px rgba(0, 0, 0, 0.25)")
    time = $(this).text();
    console.log($(this).text());
    event.stopPropagation();
  });

  // Filter dropdown function(RE)
  var dropdown = document.querySelector('.dropdown');
    dropdown.addEventListener('click', function(event) {
    event.stopPropagation();
    dropdown.classList.toggle('is-active');
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


  // used to select a random event provided by the API.
function getRandomNumber(total){
    return(Math.floor(Math.random() * total))
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
    var latlong = latitude + "," + longitude;
    var ticketMasterURL =
      "https://app.ticketmaster.com/discovery/v2/events.json?size=100&apikey=" +
      apiTicketmaster + "&" + latlong;

    console.log(ticketMasterURL);

    $.ajax({
      type: "GET",
      url: ticketMasterURL,
      async: true,
      dataType: "json",
      success: function (json) {
        console.log(json);
        // showEvents(json);
      }
    }).then(function(response) {


      var eventTitle = response._embedded.events[0].name;
      var imageURL = response._embedded.events[0].images[8].url
      var eventImage = $("<img>").attr("src", imageURL);

      console.log(eventTitle)
      // $("#resultFou").text(eventTitle)
      // $("resultFou").prepend(eventImage);
      
    }
  )};

    var timeDelay = 500;
      setTimeout(ticketMaster(), timeDelay);



});