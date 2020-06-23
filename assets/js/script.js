<<<<<<< HEAD
// Co-ordinates variables
var latitude;
var longitude;
=======
// Co-ordinates variables ----------------------------------
var latitude = "undefined";
var longitude = "undefined";
>>>>>>> 4c875bee2b3bb8b65da8580c15e35403d7a79df6

// Category variables(RE) ----------------------------------
var outdoors = false;
var events = false;
var food = true;
var movies = true;
var cost = "";
var loc = "";
var time = "";
var zaMato; // global variable for object ----------------------------------
var ticketM;


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

  // Filter dropdown function(RE) ----------------------------------
  var dropdown = document.querySelector(".dropdown");
  dropdown.addEventListener("click", function (event) {
    event.stopPropagation();
    dropdown.classList.toggle("is-active");
  });

  function zomatoAPI() {

    $.ajax({
      url:
        "https://developers.zomato.com/api/v2.1/geocode?lat=" + latitude + "&lon=" + longitude +
        "&count=5",
      method: "GET",
      timeout: 0,
      headers: {
        Accept: "application/json",
        "user-key": "8ad7cae02b2d6a7122357d5b80d69935",
      },
      success: function(response) {
        console.log(response);
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
            location: {
              locality
            },
          } = data;
          var restaurantTime = "12:00:00";
          var restaurantCat = "food";
  
          restaurants.push({
            name: name,
            cost: price_range,
            url: url,
            img: featured_image,
            shortdesc: name +  " specializes in " + data.cuisines + ".",
            location: locality,
            longdesc: name + " is the best restaurant in " + locality + ".",
            time: restaurantTime,
            cat: restaurantCat
          });
        }
        console.log("the restaurants are")
        console.log(restaurants + "the restaurants") ;
        populateResults(restaurants,0);
   
			}
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
      var eventCost = "$$$"
      var eventTime = response._embedded.events[0].dates.start.localTime
      var eventLocation = response._embedded.events[0]._embedded.venues[0].city.name
      var eventShortDescription = "Promoted by: " + response._embedded.events[0].promoter.name
      var eventURL = response._embedded.events[0].url
      var eventLongDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      var eventImageURL = response._embedded.events[0].images[8].url
      var categoryEvent = "Events"
      

      console.log(eventTitle)
      console.log(eventCost)
      console.log(eventTime)
      console.log(eventLocation)
      console.log(eventShortDescription)
      console.log(eventURL)
      console.log(eventImageURL)
      console.log(categoryEvent)
    }
  )};

  // time out function to allow for geolocation to be enabled ----------------------------------
  setTimeout(function() {
      tripAd();
  }, 2000);

  function tripAd() {

    // Local to your area in melbourne (local) ----------------------------------
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://tripadvisor1.p.rapidapi.com/attractions/list-by-latlng?lunit=km&currency=USD&limit=30&distance=5&lang=en_US&longitude=" + longitude + "&latitude=" + latitude,
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
        "x-rapidapi-key": "fdb9978b68mshd6275eb4a4e31a6p16d146jsn8702ceda1ca0"
      }
    }
    
    $.ajax(settings).done(function (response) {
      console.log("I am a random activity local to the user");

      console.log(response)

      var randNum = Math.floor(Math.random() * 32);
      var localName = response.data[randNum].name;
      // var localCost = response.data[randNum].offer_group.lowest_price
      // var localTime = response.data[randNum].hours.week_ranges[1][0];
      var localDesc = response.data[randNum].description;
      var localUrl = response.data[randNum].web_url;
      var localImag = response.data[randNum].photo.images.small.url;
      var localCate = response.data[randNum].subcategory[0].name;

      // Sometimes the call fails due to not all the returns being the same. If the
      // call exists we should allow it, otherwise, do not attempt return and value = nil, 
      // nil value will equal lowest price range and return in both day and night filters.

      console.log(localName);
      // console.log(localCost);
      // console.log(localTime);
      console.log(localDesc);
      console.log(localUrl);
      console.log(localImag);
      console.log(localCate);
    });

    // activities out to melbourne area (near) ----------------------------------
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://tripadvisor1.p.rapidapi.com/attractions/list?lang=en_US&currency=USD&sort=recommended&lunit=km&location_id=255099",
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
        "x-rapidapi-key": "fdb9978b68mshd6275eb4a4e31a6p16d146jsn8702ceda1ca0"
      }
    }
    
    $.ajax(settings).done(function (response) {
      console.log("I am a random activity up to melbourne")

      // var randNum = Math.floor(Math.random() * 32);
      // var nearName = response[randNum].name;
      // var nearCost = response[randNum].offer_group.lowest_price;
      // var nearTime = response.hours.week_ranges;
      // var nearDesc = response[randNum].description;
      // var nearUrl = response[randNum].website
      // var nearImag = response[randNum].photo.images.small.url;
      // var nearCate = response[randNum].category.name

      // console.log(nearName);
      // console.log(nearCost);
      // console.log(nearTime);
      // console.log(nearDesc);
      // console.log(nearUrl);
      // console.log(nearImag);
      // console.log(nearCate);
    });

    // activities out to greater melbourne (near) ----------------------------------
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://tripadvisor1.p.rapidapi.com/attractions/list?lang=en_US&currency=USD&sort=recommended&lunit=km&location_id=2699946",
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
        "x-rapidapi-key": "fdb9978b68mshd6275eb4a4e31a6p16d146jsn8702ceda1ca0"
      }
    }
    
    $.ajax(settings).done(function (response) {
      console.log("I am a random activity up to the greater melbourne")

      // var randNum = Math.floor(Math.random() * 32);
      // var farName = response[randNum].name;
      // var farCost = response[randNum].offer_group.lowest_price;
      // var farTime = response.hours.week_ranges;
      // var farDesc = response[randNum].description;
      // var farUrl = response[randNum].website
      // var farImag = response[randNum].photo.images.small.url;
      // var farCate = response[randNum].category.name

      // console.log(farName);
      // console.log(farCost);
      // console.log(farTime);
      // console.log(farDesc);
      // console.log(farUrl);
      // console.log(farImag);
      // console.log(farCate);
    });
  };

  // Davids Code ----------------------------------
    function returnRandom(number) {
      return(Math.floor(Math.random() * number));
    }


         function populateResults(populateThis, source) {
          var sources = ['zomatoAPI','ticketMaster','tripAdvisor']  
          var cost = ['$','$$','$$$','$$$$', '$$$$$']
          
            // cant really finish this until we have more than one API working.

          if (source === 0) {
            zomatoAPI = populateThis;
                console.log(zomatoAPI);
                var useThis = returnRandom(populateThis.length);
                  console.log("record to use" + useThis);
                    var addThis = populateThis[useThis];
                      // each function will be like the above - however one piece of code
                      // the results will populate into the input box. with the values of the keys
                      // remaining universal for all of them. 

                      // all 3 api's will populate into boxes 1 and two? I think.
                      // the filter function will clear box 1 and box 2.
                      // from here we can repopulate.

                    console.log("dumping here");
                      console.log(addThis);

                    }     
                  
                      // if the variable is populated;
                        // added classes - boxOne: nameClass, descClass, locationClass, timeClass, 
                        // div 2
                        // boxTwo: secondDivLongDesc, prettyPic

            if (addThis) {

              var newDivTitle = $("<p>");
                  if (addThis.cat === "food") {newDivTitle.text("Something to eat?");}
                      newDivTitle.attr("class","nameClassTitle boxOne");

                  var newDiv = $("<p>");
                  var theplaceTitle = addThis.name; // used in box 1 and 2
                      newDiv.text(theplaceTitle);
                      newDiv.attr("class","nameClass boxOne");
                  
                  var newDivDesc = $("<p>");
                      newDivDesc.text(addThis.shortdesc);                      
                      newDivDesc.attr("class","descClass boxOne");                       


                  var newDivLocation = $("<p>");
                      newDivLocation.text("Location : " + addThis.location);
                      newDivLocation.attr("class","locationClass boxOne");

                      
                  var newDivOpening = $("<p>");
                      newDivOpening.text("Time : " + addThis.time);
                      newDivOpening.attr("class","timeClass boxOne");
  
                              
             $("#resultOne").append(newDivTitle, newDiv,newDivDesc,newDivLocation,newDivOpening );
                        $("#resultOne").on("click",function() {
                          window.open(addThis.url);
                        })

             var secondDivTitle = $("<p>");
                  secondDivTitle.text(theplaceTitle + " --- Cost : " + cost[addThis.cost]);
                  secondDivTitle.attr("class","nameClass boxTwo");

              var secondDivLongDesc = $("<p>");
                  secondDivLongDesc.text(addThis.longdesc);
                  secondDivLongDesc.attr("class","secondDivLongDesc boxTwo");

              var prettyPic = $("<img>")
                  prettyPic.attr("src",addThis.img);
                  prettyPic.attr("class","prettyPic boxTwo");

              
        $("#resultTwo").append(secondDivTitle, secondDivLongDesc, prettyPic);

                


                  }


            }
   
  // this needs to be run straight away to assign the variables.
  getGeoLocations();

  var timeDelay = 2900;
  setTimeout(zomatoAPI, timeDelay);


});
