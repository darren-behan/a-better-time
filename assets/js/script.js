// Co-ordinates variables ----------------------------------
var latitude = "undefined";
var longitude = "undefined";

// Category variables(RE) ----------------------------------
var outdoors = false;
var events = false;
var food = true;
var movies = true;
var loc = "";
var time = "";
var zaMato; // global variable for object ----------------------------------
var ticketM;
var tripAdvisor;
var categories = []; // global variable for selection of categories
var costSearch = "$";


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

  $(".time").on("click", function () {


    $(".time").css("box-shadow", "unset");
    $(this).css("box-shadow", "inset 4px 4px 4px rgba(0, 0, 0, 0.25)");



    time = $(this).text();
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
    $.ajax({
      url:
        "https://developers.zomato.com/api/v2.1/geocode?lat=" +
        latitude +
        "&lon=" +
        longitude +
        "&count=5",
      method: "GET",
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
          var {
            name,
            price_range,
            url,
            featured_image,
            location: { locality },
          } = data;

          restaurants.push({
            name: name,
            cost: price_range,
            url: url,
            img: featured_image,
            shortdesc: name + " specializes in " + data.cuisines + ".",
            location: locality,
            longdesc: name + " is the best restaurant in " + locality + ".",
            time: "12:00:00",
            cat: "food",
          });
        }
        // set global variable zaMato
        zaMato = restaurants;
        populateResults(restaurants, 0);
      },
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
          // console.log("lat " + latitude + " long + :" + longitude);
        },

        function fail(data, status) {
          // If this fails, we need to get the users ip address to find location settings.
          //console.log("Request failed.  Returned status of", status);
        }
      );
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
  
    $.ajax({
      type: "GET",
      url: ticketMasterURL,
      async: true,
      dataType: "json",
      success: function (response) {
      var events = [];
      var eventList = response._embedded.events;
      for (var event of eventList) {
        var data = event;
        if (data.images === undefined || data.promoter === undefined || data._embedded === undefined || data.dates === undefined) {
          continue;
        }
        
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

  ticketMaster();

  // Trip Advisor API call based on users location
  function tripAd() {
    $.ajax({
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
        "x-rapidapi-key": "0c211c59f1msh6b3dc76ba9cbcaap19572cjsnf4d5920b5e14",
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
            category,
            subcategory,
            address_obj,
          } = data;

          events.push({
            name: name,
            cost: 3,
            url: web_url,
            img: photo.images.small.url,
            shortdesc: name + " specializes in " + subcategory[0].name + ".",
            location: address_obj,
            longdesc:
              name +
              " will provide the best entertainment in " +
              address_obj.city +
              ".",
            time: "15:00:00",
            cat: category.name,
          });
        }
        console.log(events);
        tripAdvisor = events;
        populateResults(events, 2);
      },
    });
  }


  function returnRandom(number) {
    return Math.floor(Math.random() * number);
  }

  function populateResults(populateThis, source) {
     var sources = ["zomatoAPI", "ticketMaster", "tripAdvisor"];
     var cost = ["$", "$$", "$$$", "$$$$", "$$$$$"];

    // this result has come in from one of the API's
    // as such, utilise the api data to trigger one event

    if (source === 0) {
      zomatoAPI = populateThis;
        console.log("Dumping Zomato");
          }
    if (source === 2) {
      tripAd = populateThis;
        console.log("Dumping Trip Add");
          }

    

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


      $("#" + theDivId).on("click", function () {
        window.open(addThis.url);
      })




      $("#resultOne").append(newDivTitle, newDiv, secondDivLongDesc, newDivLocation, newDivOpening, prettyPic);
      //$("#resultTwo").append(secondDivTitle, secondDivLongDesc, prettyPic);
    
  }

    function filterResults() {
    // function to view filtered options and send result to populate results
    // itterate through categories
    // clean up results
    
    $(".boxOne").remove();

      for (var theseCategories of categories) {
        console.log("checking category"+ theseCategories);
                if (theseCategories === "Food") { theArray = zaMato; var sourceID = 0;}
                if (theseCategories === "Activities") { theArray = tripAdvisor; var sourceID = 2;}
                if (theseCategories === "Events") { continue; } // as the events array is not ready yet, exit the loop
            
            if (theArray !== "undefined") {
          
    
              // filter the results based on 
              const result = theArray.filter(thearrayResult => thearrayResult.cost == (costSearch.length - 1).toString());
            
        // send the random result for population to the screen assuming we have more than 0 results.
               
           if (result.length >  0) {     
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




  // this needs to be run straight away to assign the variables.
  getGeoLocations();

  var timeDelay = 900;
  setTimeout(zomatoAPI, timeDelay);

  var timeDelay = 500;
  setTimeout(tripAd, timeDelay);

});
