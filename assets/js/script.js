// Co-ordinates variables ----------------------------------
var latitude = "undefined";
var longitude = "undefined";

// Category variables(RE) ----------------------------------
var outdoors = false;
var events = false;
var food = true;
var movies = true;
var loc = "far";

var zaMato; // global variable for object ----------------------------------
var ticketM;
var tripAdvisor;
var categories = ["Food","Activities","Events"]; // global variable for selection of categories
var costSearch = "$$$$";


$(document).ready(function () {
  // First page button - Day(RE) ----------------------------------
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

  // First page button - Night(RE) ----------------------------------
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

  // Category selection when using filter dropdown(RE) ----------------------------------
  $(".cat").on("click", function () {

    var currentStatus = $(this).data("status");
    // the data-variable status is checked. if it is defined then it is active
    if ((currentStatus === "active") && (currentStatus !== "undefined")) {
      $(this).data("status", "inactive");
      // reset box shadow to nothing

      console.log("removing box shadow");
         $(this).css("box-shadow", "unset");

      // ok - let's see if this.. category is in the array.

      if (categories.includes($(this).text())) {
        // the value is currently in the array, let's delete it
        categories = categories.filter(item => item !== $(this).text());
        console.log(categories)
      }
    }
    else
    // make it active again and add the corney boxshadow effect
    {
      $(this).data("status", "active");
      // add box shadow to original status
      console.log("adding box shadow");
      $(this).css("box-shadow", "inset 4px 4px 4px rgba(0, 0, 0, 0.25)");
      // now let's add this value to the array
      categories.push($(this).text());



    }

    console.log($(this).text());
    event.stopPropagation();
  });
  //
  $(".cost").on("click", function () {

    // lets reset all the cost buttons to nothing.
    $(".cost").css("box-shadow", "unset");
      $(this).css("box-shadow", "inset 4px 4px 4px rgba(0, 0, 0, 0.25)");
      event.stopPropagation();
      // let's set the global var costSearch to this value
      costSearch = $(this).text();


  });

  $(".loc").on("click", function () {
    $(".loc").css("box-shadow", "unset");
    $(this).css("box-shadow", "inset 4px 4px 4px rgba(0, 0, 0, 0.25)");
    loc = $(this).text();
    console.log($(this).text());
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
      async : true,
      timeout: 0,
      headers: {
        Accept: "application/json",
        "user-key": "8ad7cae02b2d6a7122357d5b80d69935",
      },
      success: function (response) {
        var restaurants = [];
        var restaurantList = response.nearby_restaurants;

        // console.log('zomatoAPI:', response);

        for (var restaurant of restaurantList) {
          var data = restaurant.restaurant;
          // object deconstructing
          var {
            name,
            price_range,
            url,
            featured_image,
            location,
          } = data;

          restaurants.push({
            name: name,
            cost: price_range,
            url: url,
            distance : null,
            img: featured_image,
            shortdesc: name + " specializes in " + data.cuisines + ".",
            location: location.locality,
            latitude: +location.latitude || null,
            longitude: +location.longitude || null,
            longdesc: name + " is the best restaurant in " + location.locality + ".",
            time: "12:00:00",
            cat: "food",
          });
        }
        // set global variable zaMato
        zaMato = restaurants;


        // ok now let's update the distance field

        populateResults(restaurants, 0);

      },
    });
  }

  function updateArray(sender) {
    if (sender == 0) { thisArray = zaMato; }
    if (sender == 2) { thisArray = tripAdvisor; }

      for (i = 0; i < thisArray.length; i++) {

        if (thisArray[i].latitude !== null && thisArray[i].longitude !== null) {
          thisArray[i].d = calculateAndUpdate(thisArray[i].latitude, thisArray[i].longitude);
        }
      }
  }


  function calculateAndUpdate(theLat,theLng,i, sender) {
// this function will itterate through the array and insert the geo location
// as provided by the original provided data and insert that into
// the object



      // In address. now let's calculate how far it
      // is from our current location

      const R = 6371e3; // metres
      const φ1 = latitude * Math.PI/180; // φ, λ in radians
      const φ2 = theLat * Math.PI/180;
      const Δφ = (theLat-latitude) * Math.PI/180;
      const Δλ = (theLng-longitude) * Math.PI/180;

      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

      const d = Math.floor(R * c); // in metres
     // console.log("the total distance is " + d);

      if (sender == 0) {
        // this is zamato
        zaMato[i].distance = d;
      }

      if (sender == 2) {
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
        alert('NO COORDINATES');
        // If this fails, we need to get the users ip address to find location settings.
        //console.log("Request failed.  Returned status of", status);
      }
    );
  }

  // cb is a callback
  function getGeoLocations(cb) {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;

        cb();

        // exit
        return;
      }, function () {
        console.log('No rights to access geolocation. Will try to get location from IP`');

        getGeoLocationsFromIp(cb);
      });
    } else {
      getGeoLocationsFromIp(cb);
    }
  }

  function ticketMaster() {
    var apiTicketmaster = "2fd4BLBJMbQOCZ46tstmLFQbHrYGeXCs";
    var latlong = latitude + "," + longitude;
    console.log(latlong)
    var ticketMasterURL =
      "https://app.ticketmaster.com/discovery/v2/events.json?&dmaId=701&size=20&apikey=" +
      apiTicketmaster
      // "&" +
      // latlong;

    console.log(ticketMasterURL);

    return $.ajax({
      type: "GET",
      url: ticketMasterURL,
      async: true,
      dataType: "json",
      success: function (response) {
        console.log('ticketMasterURL:', response);

      var events = [];
      var eventList = response._embedded.events;
      for (var event of eventList) {
        var data = event;
        if (data.images === undefined || data.promoter === undefined || data._embedded === undefined || data.dates === undefined) {
          continue;
        }

        comnsole.log("top");
        console.log(event);
        console.log("bottom");

        var {
          name,
          url,
          images,
          // promoter,
          _embedded,
          dates,
      } = data;

      var eventCost = "$$$"
      var categoryEvent = "Events"
      var eventLongDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."



      events.push({
        name: name,
        cost: eventCost,
        url: url,
        img: images[8].url,
        shortdesc: "Promoted by: " + data.promoter.name,
        location: _embedded.venues[0].city.name,
        longdesc: eventLongDescription,
        time: dates.start.localTime,
        cat:categoryEvent
      })
    }
    console.log(events)
    }
  })}

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
        "x-rapidapi-key": "1730421ec2msh67099de7682ba92p1680b6jsnbe83668d17c8",
      },
      success: function (response) {
        // console.log('tripAd:', response);
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
            category,
            subcategory,
            address,
            address_obj,
            latitude,
            longitude
          } = data;


          events.push({
            name: name,
            cost: 3,
            distance : null,
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
            time: "15:00:00",
            cat: category.name,
          });
        }
       // console.log(events);
       // set the global variable
        tripAdvisor = events;
        // update the distance location from address
       // updateArray(2);
        populateResults(events, 2);
      },
    });
  }


  function returnRandom(number) {
    return Math.floor(Math.random() * number);
  }



  function populateResults(populateThis, source) {
     var cost = ["$", "$$", "$$$", "$$$$", "$$$$$"];


    // this result has come in from one of the API's
    // as such, utilise the api data to trigger one event

   console.log(populateThis);



      var useThis = returnRandom(populateThis.length);
        var addThis = populateThis[useThis];



    if (addThis) {

      var prettyPicCont = $("<div>")
      prettyPicCont.attr("class", "prettyPicCont")

      var prettyPic = $("<img>")
      prettyPic.attr("src", addThis.img);
      prettyPic.attr("class", "prettyPic boxOne");

      var newDivTitle = $("<p>");

      if (addThis.cat === "food") {
        newDivTitle.text("Something to eat?");
        theDivId = '01';
      }

      if (addThis.cat === "Activities") {

        newDivTitle.text("Something special ?");
        theDivId = '02';

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

      var prettyPic = $("<img>")
      prettyPic.attr("src", addThis.img);
      prettyPic.attr("id", theDivId);
      prettyPic.attr("class", "prettyPic boxOne");

      var hoLine = $("<hr>");
      hoLine.attr("class", "hoLine");

      var webUrl = $("<button>");
      webUrl.attr("class", "webClass button is-dark");
      webUrl.text("Website");

      webUrl.on("click", function() {
        window.open(addThis.url)
      });

      $("#resultOne").append(newDivTitle, hoLine, prettyPic, newDiv, secondDivLongDesc, newDivLocation, newDivOpening, webUrl);


  }


    function filterResults() {
    // function to view filtered options and send result to populate results
    // itterate through categories
    // clean up results // if they exist

    $(".boxOne").remove();
    $("#resultOne").empty();



    //$(".hoLine").remove();  
    
      console.log(categories);
      console.log("the categories");

      for (var theseCategories of categories) {
        console.log("checking category"+ theseCategories);
                if (theseCategories === "Food") { theArray = zaMato; var sourceID = 0;}
                if (theseCategories === "Activities") { theArray = tripAdvisor; var sourceID = 2;}
                if (theseCategories === "Events") { continue; } // as the events array is not ready yet, exit the loop

        
  
   if (theArray !== "undefined") {

    // filter the results based on $$$

      var result = theArray.filter(thearrayResult => thearrayResult.cost <= (parseInt(costSearch.length).toString() - 1));

        // send the random result for population to the screen assuming we have more than 0 results.

      if (result.length > 0) {
          // filter results based on distance
         
          if (loc = "local") {theDistance = 1000;}
          if (loc = "near") {theDistance = 10000;}
          if (loc = "far") {theDistance = 100000;}
            result = result.filter(thearrayResult => thearrayResult.d <= theDistance);

              }

           if (result.length >  0) {
            
            console.log("the filtered result");
            console.log(result);
            console.log("------/")
            var doThisOne = returnRandom(result.length);
                  populateResults(result, sourceID);
                      }


                }
              }


  }


  $(".refineSearch").on("click", function () {
    // trigger populateResults with null to indicate that this is a refined search
    filterResults();
  })


  $(".refreshBtn").on("click", function () {
    // trigger populateResults with null to indicate that this is a refined search
    filterResults();
  })

  
  


  // this needs to be run straight away to assign the variables.
  getGeoLocations(function () {
   
    // alternative option is to run everything in parrallel
    Promise.all([zomatoAPI(), tripAd(), ticketMaster()]).then(() => {
      // if we are here then we could managed to run zomato, tripAt and ticketMaster in parallel
      // here we are free to run whatever we want

      updateArray(0);
      updateArray(2);
    }).catch(() => {
      console.log('Whoops, something is wrong');
    })


  });



});
