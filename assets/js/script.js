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