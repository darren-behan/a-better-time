// Co-ordinates variables
var latitude = "undefined";
var longitude = "undefined";

// Category variables(RE)
var outdoors = false;
var events = false;
var food = true;
var movies = true;
var cost = "";
var loc = "";
var time = "";

$(document).ready(function () {
  // First page button - Day(RE)
  $(".initBtnOne").on("click", function () {
    setInterval(function () {
      $(".container").fadeOut("slow");
      setInterval(function () {
        $(".navbar").css("visibility", "visible");
        $(".contain").css("display", "block");
        $(".results").css("display", "flex");
        $(".header").css("display", "block");
      }, 1000);
    }, 500);
  });

  // First page button - Night(RE)
  $(".initBtnTwo").on("click", function () {
    setInterval(function () {
      $(".container").fadeOut("slow");
      setInterval(function () {
        $(".navbar").css("visibility", "visible");
        $(".contain").css("display", "block");
        $(".results").css("display", "flex");
        $(".header").css("display", "block");
      }, 1000);
    }, 500);
  });

  // Category selection when using filter dropdown(RE)
  $(".cat").on("click", function () {
    $(this).css("box-shadow", "inset 4px 4px 4px rgba(0, 0, 0, 0.25)");
    $(this).css("background-color", "#757575");
    console.log($(this).text());
    event.stopPropagation();
  });

  $(".cost").on("click", function () {
    $(this).css("box-shadow", "inset 4px 4px 4px rgba(0, 0, 0, 0.25)");
    cost = $(this).text();
    console.log($(this).text());
    event.stopPropagation();
  });

  $(".loc").on("click", function () {
    $(this).css("box-shadow", "inset 4px 4px 4px rgba(0, 0, 0, 0.25)");
    loc = $(this).text();
    console.log($(this).text());
    event.stopPropagation();
  });

  $(".time").on("click", function () {
    $(this).css("box-shadow", "inset 4px 4px 4px rgba(0, 0, 0, 0.25)");
    time = $(this).text();
    console.log($(this).text());
    event.stopPropagation();
  });

  // Filter dropdown function(RE)
  var dropdown = document.querySelector(".dropdown");
  dropdown.addEventListener("click", function (event) {
    event.stopPropagation();
    dropdown.classList.toggle("is-active");
  });

  zomatoAPI();

  function zomatoAPI() {
    var settings = {
      url:
        "https://developers.zomato.com/api/v2.1/geocode?lat=-37.96182&lon=145.14314&count=5",
      method: "GET",
      timeout: 0,
      headers: {
        Accept: "application/json",
        "user-key": "8ad7cae02b2d6a7122357d5b80d69935",
      },
    };

    $.ajax(settings).done(function (response) {
      console.log(response);
      var restaurantList = response.nearby_restaurants;
      var randomRestaurantIndex = Math.floor(
        Math.random() * response.nearby_restaurants.length
      );
      var restaurantName =
        restaurantList[randomRestaurantIndex].restaurant.name;
      var restaurantCuisine =
        restaurantList[randomRestaurantIndex].restaurant.cuisines;
      var restaurantPriceRange =
        restaurantList[randomRestaurantIndex].restaurant.price_range;
      var restaurantAvgCostForTwo =
        restaurantList[randomRestaurantIndex].restaurant.average_cost_for_two;
      var restaurantUrl = restaurantList[randomRestaurantIndex].restaurant.url;

      $("#resultTwo").append(
        $("<div>").text("Restaurant Name: " + restaurantName)
      );
      $("#resultTwo").append(
        $("<div>").text("Restaurant Cuisine: " + restaurantCuisine)
      );
      $("#resultTwo").append(
        $("<div>").text("Restaurant Price Range: " + restaurantPriceRange)
      );
      $("#resultTwo").append(
        $("<div>").text(
          "Restaurant Avg. Cost for two: " + restaurantAvgCostForTwo
        )
      );
      $("#resultTwo").append(
        $("<div>").html(
          $("<a>").attr("href", restaurantUrl).text("Restaurant Website")
        )
      );
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
    var latlong = latitude + "," + longitude;
    var ticketMasterURL =
      "https://app.ticketmaster.com/discovery/v2/events.json?size=100&apikey=" +
      apiTicketmaster +
      "&" +
      latlong;

    console.log(ticketMasterURL);

    $.ajax({
      type: "GET",
      url: ticketMasterURL,
      async: true,
      dataType: "json",
      success: function (json) {
        console.log(json);
        // showEvents(json);
      },
    }).then(function (response) {
      var eventTitle = response._embedded.events[0].name;
      var imageURL = response._embedded.events[0].images[8].url;
      var eventImage = $("<img>").attr("src", imageURL);

      console.log(eventTitle);
      // $("#resultFou").text(eventTitle)
      // $("resultFou").prepend(eventImage);
    });
  }

  var timeDelay = 500;
  setTimeout(ticketMaster(), timeDelay);

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
