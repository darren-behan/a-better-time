// Co-ordinates variables ----------------------------------
var latitude = "undefined";
var longitude = "undefined";

// Category variables(RE) ----------------------------------
var outdoors = false;
var food = true;
var movies = true;
var loc = "far"; // global variable for selection of location from here.

var zoMato; // global variable for object ----------------------------------
var tripAdvisor;
var categories = ["Food", "Activities"]; // global variable for selection of categories
var costSearch = "$$$$";
var totalDisplayed = 0;
var modal = $(".modalOne");
var modalLoad = $(".modalTwo");

$(document).ready(function () {
  // First Page
  setInterval(function () {
    $(".brandStatement").fadeIn("slow");
  }, 1000);

  setInterval(function () {
    $(".container").fadeOut("slow");
    $(".brandStatement").fadeOut("slow");
    $(".hintOne").fadeOut("slow");
    setInterval(function () {
      $(".navbar").css("visibility", "visible");
      $(".contain").css("display", "block");
      $(".results").css("display", "flex");
      $(".header").css("display", "block");
    }, 500);
  }, 3000);

  // Category selection when using filter dropdown(RE) ----------------------------------
  $(".cat").on("click", function () {
    var currentStatus = $(this).data("status");
    // the data-variable status is checked. if it is defined then it is active
    if (currentStatus === "active" && currentStatus !== "undefined") {
      $(this).data("status", "inactive");
      // reset box shadow to nothing

      $(this).css("box-shadow", "unset");

      // ok - let's see if this.. category is in the array.

      if (categories.includes($(this).text())) {
        // the value is currently in the array, let's delete it
        categories = categories.filter((item) => item !== $(this).text());
      }
    }
    // make it active again
    else {
      // because categories is already in the array at time of setting the global variable,
      // lets check again just to make sure it is not here

      categories = categories.filter((item) => item !== $(this).text());
      $(this).data("status", "active");
      // add box shadow to original status
      $(this).css("box-shadow", "inset 4px 4px 4px rgba(80, 63, 255, 0.25)");
      // now let's add this value to the array
      categories.push($(this).text());
    }

    event.stopPropagation();
  });
  //
  $(".cost").on("click", function () {
    // lets reset all the cost buttons to nothing.
    $(".cost").css("box-shadow", "unset");

    $(this).css("box-shadow", "inset 4px 4px 4px rgba(80, 63, 255, 0.25)");
    event.stopPropagation();
    // let's set the global var costSearch to this value
    costSearch = $(this).text();
  });

  $(".loc").on("click", function () {
    $(".loc").css("box-shadow", "unset");
    $(this).css("box-shadow", "inset 4px 4px 4px rgba(80, 63, 255, 0.25)");
    loc = $(this).text();
    event.stopPropagation();
  });

  // Filter dropdown function(RE) ----------------------------------
  var dropdown = document.querySelector(".dropdown");
  dropdown.addEventListener("click", function (event) {
    event.stopPropagation();
    dropdown.classList.toggle("is-active");
  });

  function zomatoAPI() {
    return $.ajax({
      url:
        "https://developers.zomato.com/api/v2.1/geocode?lat=" +
        latitude +
        "&lon=" +
        longitude +
        "&count=50",
      method: "GET",
      async: true,
      timeout: 0,
      headers: {
        Accept: "application/json",
        "user-key": "8ad7cae02b2d6a7122357d5b80d69935",
      },
      success: function (response) {
        var restaurants = [];
        var restaurantList = response.nearby_restaurants;

        for (var restaurant of restaurantList) {
          var data = restaurant.restaurant;
          // object deconstructing
          var { name, price_range, url, featured_image, location } = data;

          restaurants.push({
            name: name,
            cost: price_range,
            url: url,
            distance: null,
            img: featured_image,
            shortdesc: name + " specializes in " + data.cuisines + ".",
            location: location.locality,
            latitude: +location.latitude || null,
            longitude: +location.longitude || null,
            longdesc:
              name + " is the best restaurant in " + location.locality + ".",
            cat: "food",
          });
        }
        // set global variable zaMato
        zoMato = restaurants;

        // let's update the distance field
        populateResults(restaurants, 0);
      },
    });
  }

  function updateArray(sender) {
    if (sender == 0) {
      thisArray = zoMato;
    }
    if (sender == 2) {
      thisArray = tripAdvisor;
    }

    for (i = 0; i < thisArray.length; i++) {
      if (thisArray[i].latitude !== null && thisArray[i].longitude !== null) {
        thisArray[i].d = calculateAndUpdate(
          thisArray[i].latitude,
          thisArray[i].longitude
        );
      }
    }
  }

  // Calculates distance for filter (sourced from => https://medium.com/@RichLloydMiles/calculate-the-distance-between-two-points-on-earth-using-javascript-38e12c9a0f52)
  function calculateAndUpdate(theLat, theLng, i, sender) {
    // this function will itterate through the array and insert the distance in meters
    // as provided by the original geo lat locations

    // In address. now let's calculate how far it
    // is from our current location

    const R = 6371e3; // metres
    const φ1 = (latitude * Math.PI) / 180; // φ, λ in radians
    const φ2 = (theLat * Math.PI) / 180;
    const Δφ = ((theLat - latitude) * Math.PI) / 180;
    const Δλ = ((theLng - longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = Math.floor(R * c); // in metres

    if (sender == 0) {
      // this is zamato
      zoMato[i].distance = d;
    }

    if (sender == 2) {
      // this is trip advisor - bet you could never guess.
      tripAdvisor[i].distance = d;
    }

    return d;
  }

  function getGeoLocationsFromIp(cb) {
    $.ajax("http://ip-api.com/json").then(
      function success(response) {
        latitude = response.lat;
        longitude = response.lon;

        cb();
      },

      function fail(data, status) {
        // in the event that neither the long or lat is not available,
        // provide a melbourne cbd location

        latitude = "-37.813629";
        longitude = "144.963058";
      }
    );
  }

  // cb is a callback
  function getGeoLocations(cb) {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;

          cb();

          return;
        },
        function () {
          console.log(
            "No rights to access geolocation. Will try to get location from IP`"
          );

          getGeoLocationsFromIp(cb);
        }
      );
    } else {
      getGeoLocationsFromIp(cb);
    }
  }

  // Trip Advisor API call based on users location
  function tripAd() {
    return $.ajax({
      async: true,
      crossDomain: true,
      url:
        "https://tripadvisor1.p.rapidapi.com/attractions/list-by-latlng?lunit=km&currency=AUD&limit=30&distance=5&lang=en_US&longitude=" +
        longitude +
        "&latitude=" +
        latitude,
      method: "GET",
      headers: {
        "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
        "x-rapidapi-key": "8138a11da9mshfc11bc8c3d90f4dp1d2441jsn9396043e3d4b",
      },
      success: function (response) {
        console.log(response);
        var events = [];
        var eventList = response.data;
        for (var event of eventList) {
          var data = event;
          if (
            data.category === undefined ||
            data.photo === undefined ||
            data.subcategory === undefined
          ) {
            continue;
          }
          var {
            name,
            web_url,
            photo,
            subcategory,
            address,
            address_obj,
            latitude,
            longitude,
          } = data;

          events.push({
            name: name,
            cost: 3,
            distance: null,
            url: web_url,
            img: photo.images.small.url,
            shortdesc: name + " specializes in " + subcategory[0].name + ".",
            location: address,
            latitude: +latitude, // convert to float by adding +
            longitude: +longitude,
            longdesc:
              name +
              " will provide the best entertainment in " +
              address_obj.city +
              ".",
            cat: "Activities",
          });
        }
        // set the global variable
        tripAdvisor = events;
        populateResults(events, 2);
      },
    });
  }

  function returnRandom(number) {
    return Math.floor(Math.random() * number);
  }

  function populateResults(populateThis, source) {
    var cost = ["$", "$$", "$$$", "$$$$", "$$$$$"];

    console.log("make invisible here");

    // this result has come in from one of the API's
    // as such, utilise the api data to trigger one event

    var useThis = returnRandom(populateThis.length);
    var addThis = populateThis[useThis];

    if (addThis) {
      var newDivTitle = $("<p>");

      if (addThis.cat === "food") {
        newDivTitle.text("Something to eat?");
        theDivId = "01";
      }

      if (addThis.cat === "Activities") {
        newDivTitle.text("Something special?");
        theDivId = "02";
      }
    }

    newDivTitle.attr("class", "nameClassTitle boxOne");

    // --------------------------------------------------

    newDivTitle.attr("class", "nameClassTitle boxOne");

    var newDiv = $("<p>");
    var theplaceTitle = addThis.name; // used in box 1 and 2
    newDiv.text(theplaceTitle);
    newDiv.attr("class", "nameClass boxOne");

    var newDivDesc = $("<p>");
    newDivDesc.text(addThis.shortdesc);
    newDivDesc.attr("class", "descClass boxOne");

    var newDivLocation = $("<p>");
    newDivLocation.text("Location : " + addThis.location);
    newDivLocation.attr("class", "locationClass boxOne");

    var newDivOpening = $("<p>");
    newDivOpening.text("Time : " + addThis.time);
    newDivOpening.attr("class", "timeClass boxOne");

    var secondDivTitle = $("<p>");
    secondDivTitle.text(theplaceTitle + " --- Cost : " + cost[addThis.cost]);
    secondDivTitle.attr("class", "nameClass boxOne");

    var secondDivLongDesc = $("<p>");
    secondDivLongDesc.text(addThis.longdesc);
    secondDivLongDesc.attr("class", "secondDivLongDesc boxOne");

    var prettyPic = $("<img>");
    prettyPic.attr("src", addThis.img);
    prettyPic.attr("id", theDivId);
    prettyPic.attr("class", "prettyPic boxOne");

    var hoLine = $("<hr>");
    hoLine.attr("class", "hoLine boxOne");

    var webUrl = $("<button>");
    webUrl.attr("class", "webClass button is-dark boxOne");
    webUrl.text("Website");

    webUrl.on("click", function () {
      window.open(addThis.url);
    });

    $("#resultOne").append(
      newDivTitle,
      hoLine,
      prettyPic,
      newDiv,
      secondDivLongDesc,
      newDivLocation,
      webUrl
    );
  }

  function filterResults() {
    // function to view filtered options and send result to populate results
    // itterate through categories
    // clean up results // if they exist

    $(".boxOne").remove();
    $("#resultOne").empty();
    totalDisplayed = 0;

    for (var theseCategories of categories) {
      if (theseCategories === "Food") {
        theArray = zoMato;
        var sourceID = 0;
      }
      if (theseCategories === "Activities") {
        theArray = tripAdvisor;
        var sourceID = 2;
      }

      if (theArray !== "undefined") {
        // filter the results based on $$$
        result = theArray.filter(
          (thearrayResult) =>
            thearrayResult.cost <= parseInt(costSearch.length).toString()
        );

        // send the random result for population to the screen assuming we have more than 0 results.
        if (result.length > 0) {
          // filter results based on distance
          if ((loc = "local")) {
            theDistance = 1000;
          }
          if ((loc = "near")) {
            theDistance = 10000;
          }
          if ((loc = "far")) {
            theDistance = 100000;
          }
          result = result.filter(
            (thearrayResult) => thearrayResult.d <= theDistance
          );

          if (result.length > 0) {
            totalDisplayed = totalDisplayed + result.length;

            // Select one result from the filtered array
            var doThisOne = returnRandom(result.length);
            // populate the results to the
            populateResults(result, sourceID);
          }
        }
      }
    }

    console.log("the total displayed number is " + totalDisplayed);
    if (totalDisplayed === 0) {
      // tell the user their filter is too far refined
      console.log("make visible here");
      modal.css("display", "block");
      modal.addClass("is-active");
      modal.addClass("is-clipped");
    }
  }

  // display the pretty graphic

  modalLoad.css("display", "block");
  modalLoad.addClass("is-active");
  modalLoad.addClass("is-clipped");

  getGeoLocations(function () {
    // alternative option is to run everything in parrallel

    Promise.all([zomatoAPI(), tripAd()])
      .then(() => {
        // if we are here then we have managed to run zomato, tripAt and ticketMaster in parallel
        // here we are free to run whatever we want

        updateArray(0);
        updateArray(2);

        // hide the loading div
        modalLoad.css("display", "none");
        modalLoad.removeClass("is-active");
        modalLoad.removeClass("is-clipped");
      })
      .catch(() => {
        console.log("Whoops, something is wrong");
      });
  });

  $(".refineSearch")
    .off()
    .on("click", function () {
      // trigger populateResults with null to indicate that this is a refined search
      filterResults();
    });

  $(".refreshBtn")
    .off()
    .on("click", function () {
      // trigger populateResults with null to indicate that this is a refined search
      filterResults();
    });
});

// No results-----------------------------------------------------------
$(".okay").on("click", function () {
  modal.css("display", "none");
});

modal.removeClass("is-active");
modal.removeClass("is-clipped");
