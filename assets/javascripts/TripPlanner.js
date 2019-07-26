// On click function of submit button
$(function() {
  function clickSubmit() {
    $("body").on("click", "#submitButton1", function(event) {
      event.preventDefault();

      let results = {
        origin: $("#origin")
          .val()
          .trim(),
        destination1: $("#destination")
          .val()
          .trim(),
        departureDate: $("#departure")
          .val()
          .trim(),
        returnDate: $("#return")
          .val()
          .trim(),
        adults: $("#adults")
          .val()
          .trim(),
        children: $("#children")
          .val()
          .trim(),
        travelClass: $("#class")
          .val()
          .trim(),
        nonStop: $("#nonStop")
          .val()
          .trim(),
        currency: $("#currency")
          .val()
          .trim(),
        maxPrice: $("#maxPrice")
          .val()
          .trim(),
        max: $("#results")
          .val()
          .trim()
      };
    });
  }

  //-------------------------------------CODE --------------------------------------
  restoretripPlanner();

  // S.L - Commented this out as I would rather the html sit in the html file, I will hide if required
  // restorepointsOfInterest()

  clickSubmit();
});

//Global Scoped variables required by POI function(s)
globalObjectslist = [];

$("body").on("click", "#poiSubmit", function() {
  event.preventDefault();
  $("#poiRow").empty();
  globalObjectslist.splice(0, globalObjectslist.length);
  let city = $("#poiDestination")
    .val()
    .trim();
  // let poiType = $("#poiType").val().trim() COMING SOON
  pointsOfinterest(city);
});
