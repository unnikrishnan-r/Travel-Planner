
var flightDirection = ' ';
var globalOfferStorage = [];

/* In this application, we use APIs from https://developers.amadeus.com.
The authentication mechanism is to pass APIKEY and APISECRET using POST method to receive an access token
This access token should be used with other API calls for Authentication

For details refer: https://developers.amadeus.com/self-service/apis-docs/guides/authorization
*/
function getAccessToken() {
  //Creating the Request Body
  const url = "https://test.api.amadeus.com/v1/security/oauth2/token";
  const apikey = "15bojKjUylu27fBihpxlLclvsiiGzq0s";
  const apisecret = "aJ8oEcJx4aNP0Tzu";
  var formBody = `grant_type=client_credentials&client_id=${apikey}&client_secret=${apisecret}`;
  // console.log(formBody);

  //Executing the fetch call in POST method
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: formBody
  })
    .then(response => response.json())
    .then(function(data) {
      console.log(data)
      return data;
    });
}

/*
This function accepts input as a JS object with the various search parameters
Expectation is that the code that calls the function ensures the minimum parameters (origin, destination, departureDate)
is provided
*/
function getLowFareFlightOption(flightSearchObject) {
  //Forms the query string by iterating through the object
  const url = "https://test.api.amadeus.com/v1/shopping/flight-offers";
  let queryString = formQueryString(url, flightSearchObject);
  //Get Access Token for authorizing the API Call
  return getAccessToken()
    .then(function(data) {
      if (data.hasOwnProperty("error")) {
        $(".flightErrorMessage").remove();
        $(".flightSearchResults").remove();
        console.log("Cleared Result box");
        handleAccessTokenError(data);
      } else {
        // console.log("Access Token: " + displayObject )
        return makeamadeusApiCall(data.access_token, queryString);
      }
    })
    .catch(error => console.error(error));
}

//Iterates through the input object and forms a query string
function formQueryString(url, SearchObject) {
  let queryString = "?";
  for (var property in SearchObject) {
    queryString = `${queryString}&${property}=${SearchObject[property]}`;
  }
  // console.log(url + queryString);
  return url + queryString;
}

//This function makes the actual API Call and returns the JSON response
function makeamadeusApiCall(access_token, queryString) {
  $("#loadingImage").remove();
  $("#flightSearchInput").append(`<img id="loadingImage" src = "./assets/images/AdorableDecimalGalapagossealion-size_restricted.gif">`)
  return fetch(queryString, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + access_token
    }
  })
  
    .then(response => response.json())
    .then(function(data) {
      $("#loadingImage").remove();
      return data;
    });
}

//Function that takes a cityName and returns the iataCode
function getAirportCodeUsingCityName(cityName) {
  var citySearchObject = {
    subType: "CITY",
    keyword: cityName,
    "page[limit]": 1
  };
  const url = "https://test.api.amadeus.com/v1/reference-data/locations";
  let queryString = formQueryString(url, citySearchObject);

  return getAccessToken()
    .then(function(data) {
      return makeamadeusApiCall(displayObject.access_token, queryString);
    })
    .catch(error => console.error(error));
}

//Function to convert city with spaces into city with + i.e New York City --> New+York+City
//Using RE to replace space for +

function handleSpace(city) {
  city = city.trim().replace(/ /g, "+");

  return city;
}

//Function takes two paramters City & (interestType is optional, defaults to attraction)

//It will make an ajax call to the Yelp API and return data pertaining to city and interest type

function pointsOfinterest(city, interestType) {
  //Handle second paramter if it is not passed

  if (interestType === undefined) {
    interestType = "attractions";
  }
  //After populating response into an object (give 2 seconds for response), add poi to html
  $("#loading").removeClass("d-none");

  //Variables that will only be declared once

  const goodCity = handleSpace(city);

  const goodType = handleSpace(interestType)

  // M.T deals with max results part
  var maxResults = "3"

  if ($("#ten").is(":checked"))  {
    maxResults = "5"
   }
  const myurl =
    "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=" +
    goodCity +
    "&limit=" + maxResults + "&term=" +
    goodType +
    "";

  const apiKey =
    "4dizE_fZpusYfUraxlSSEKEE5wQLbKEYA0KDOIamkjL8P8LbqkfmR-9nz0rXQ1gyYCK2H0uQ-xiKRCDELKrJ9hAb1csxtEPSyTEKrTXhbUuvHj62AYSg8K0d6Bc2XXYx";



  //Make call to Yelp

  $.ajax({
    url: myurl,

    //Header required as per Yelp API documentation

    headers: {
      Authorization: "Bearer " + apiKey
    },

    method: "GET",

    dataType: "json",

  }).then(function(response) {
   console.log(response.businesses.length)
   if(response.businesses.length === 0){
     $("#loading").addClass("d-none");
    $("#poiCon").append(`<div class="card  shadow rounded" style="width: 100%;">                                      
    <h5 class="card-header text-center">
    <span>ERROR</span>
    <span id="address" class="card-text text-right" style="font-style: italic; font-size: 75%;">
    </span>
    </h5>                                        
    <div class="row">                                     

      <div class="col-md-12">

        <p style="text-align: center">No results returned</p>

      </div>`)
   }


    for (let i in response.businesses) {
      // console.log("Iteration Happened")
      
      globalObjectslist.push({
        Name: response.businesses[i].name,

        Address: response.businesses[i].location.display_address[1],

        Img: response.businesses[i].image_url,

        Rating: response.businesses[i].rating,

        Review_Count: response.businesses[i].review_count,

        Link: response.businesses[i].url,

        Telephone: response.businesses[i].display_phone,

        Business: response.businesses[i].id
      });
    }
    poiReviews(globalObjectslist)
  })
  .catch(function(){
    $("#loading").addClass("d-none");
    $("#poiCon").append(`<div class="card  shadow rounded" style="width: 100%;">                                      
    <h5 class="card-header text-center">
    <span>ERROR</span>
    <span id="address" class="card-text text-right" style="font-style: italic; font-size: 75%;">
    </span>
    </h5>                                        
    <div class="row">                                     

      <div class="col-md-12">

        <p style="text-align: center">No results returned</p>

      </div>`)
  })
}

function poiReviews(globalObjectslist) {
  let curIteration = 0
  for (let i in globalObjectslist) {
    const myurl =
    "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/"+globalObjectslist[i].Business+"/reviews";
    
    const apiKey =
    "4dizE_fZpusYfUraxlSSEKEE5wQLbKEYA0KDOIamkjL8P8LbqkfmR-9nz0rXQ1gyYCK2H0uQ-xiKRCDELKrJ9hAb1csxtEPSyTEKrTXhbUuvHj62AYSg8K0d6Bc2XXYx";
    
    //Make call to Yelp
  
    $.ajax({
      url: myurl,
      
      //Header required as per Yelp API documentation
      
      headers: {
        Authorization: "Bearer " + apiKey
      },
  
      method: "GET",
      
      dataType: "json"
    }).then(function(response){
      curIteration ++
      globalObjectslist[i].Review = {        
        Name : response.reviews[0].user.name,
        Text : response.reviews[0].text,
        ReviewerRating: response.reviews[0].rating,
        Timestamp : response.reviews[0].time_created
      }
      if (curIteration === (globalObjectslist.length)) {
        // console.log("This ran")
        $("#loading").addClass("d-none"); 
        addPOI(globalObjectslist)     
      }
    })
  }
}

//Function to take JSON call information and create cards to display on the webpage for each point of interest

function addPOI(listObjects) {
  for (let i in listObjects) {
    $("#poiCon")
      .append(`<div class="card poiCard shadow rounded" style="width: 100%;">                                      
                                        <h5 class="card-header text-center">
                                        <span>${listObjects[i].Name}</span>
                                        <span id="address" class="card-text text-right" style="font-style: italic; font-size: 75%;">
                                        ${listObjects[i].Address}</span>
                                        </h5>                                        
                                        <div class="row poiRow align-items-center">                                     

                                          <div class="col-md-4">

                                            <img src="${
                                              listObjects[i].Img
                                            }" class="card-img-top poiImages rounded" alt="Image here for now">

                                          </div>
                                          <div class="col-md-5">
                                          <p class="text-left reviewerName">- ${listObjects[i].Review.Name}</p>
                                          <h5 class="reviewerText">"${listObjects[i].Review.Text}"</h5>
                                          <p class="text-right">${moment(listObjects[i].Review.Timestamp).format("dddd, MMMM Do YYYY")}</p>                                          
                                          </div>
                                          <div class="col-md-3">

                                            <ul class="list-group list-group-flush poiInfo">

                                                <li class="list-group-item">Rating: ${
                                                  listObjects[i].Rating
                                                }</li>

                                                <li class="list-group-item">Review Count: ${
                                                  listObjects[i].Review_Count
                                                }</li>
                                                
                                                </li>
                                                <li class="list-group-item"><i class="fas fa-phone"></i>&nbsp;&nbsp;${listObjects[i].Telephone}
                                                </li>
                                                <li class="list-group-item"><a href="${
                                                  listObjects[i].Link
                                                }" class="card-link">Click me for more Details!</a>                                            </li>

                                            </ul>
                                          </div>

                                      </div>

                            </div>`);
  }
}

// HTML dynamic loading

function restoretripPlanner(){$("#flightSearchInput").append(`<div class="card">
<div class="card-header">
    <h5 id="header">Flight Search</h5>
</div>
<div class="information">
    <div class="row">
    <div class="col-md-3">
        <div class="form-check">
        <input class="form-check-input" type="checkbox" value="" id="Continous" checked>
        <label class="form-check-label" for="Continous">
          Non-Stop
        </label>
        </div>
        </div>
        
    
        <div class="col-md-3">
        <div class="col-10">
            <label>Adults</label>
            <select class="form-control" id="Adults">
                <option>0</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
                <option>10</option>
            </select>
            </div>
        </div>
        <div class="col-md-2">
            <label>Children</label>
            <select class="form-control" id="Children">
                <option>0</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
                <option>10</option>
            </select>
        </div>
        <div class="col-md-3">
            <div class ="col-8">
            <label for="exampleInputPassword1"> Max Price</label>
            <input type="number" class="form-control" id="Price" placeholder ="Max Price">
            </div>
        </div>
    </div>
    <br>
    <div class="row">
        <div class="col-md-3">
            <label for="exampleInputPassword1">Departure Date</label>
            <input type="date" class="form-control" id="departure" placeholder="YYYY/MM/DD">

        </div>
        <div class="col-md-3">
            <label for="exampleInputPassword1">Return Date</label>
            <input type="date" class="form-control" id="arrival" placeholder="YYYY/MM/DD">
        </div>
        <div class="col-md-2">
            <label for="exampleInputEmail1" id="heading">Origin</label>
            <input type="input" class="form-control" id="origin" placeholder="Origin">
        </div>
        <div class="col-md-2">
            <label for="exampleInputEmail1" id="heading">Destination</label>
            <input type="input" class="form-control" id="destination" placeholder="Destination">

        </div>
        <div class="col-md-1">
                <button type="submit" class="btn btn-primary form" id="submitButton1">Submit</button>
        </div>
    </div>
</div>
</div>`);
}

function restorepointsOfInterest() {
  $("#searchCon").append(`<div class="row">      
  <div class="col-md-12">
    <div class="card shadow rounded">
      <div class="card-header">
        <h5 id="header">Points of Interest</h5>            
      </div>
      <div class="information">
        <div class="row">
          <div class="col-md-2">
              <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="" id="five" checked>
                  <label class="form-check-label" for="five">
                    Max Results: 3
                  </label>
                  </div>
          </div>
          <div class="col-md-2">
              <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="" id="ten" >
                  <label class="form-check-label" for="ten">
                    Max Results: 5
                  </label>
                  </div>
          </div>
          <div class="col-md-3">
            <label for="POIDestination">Destination</label>
            <input type="input" class="form-control" id="poiDestination"
              placeholder="Enter your destination please">
          </div>
          <div class="col-md-3">
            <label for="POIType">Type of Attraction</label>
            <input type="input" class="form-control" id="poiType" placeholder="Attraction Type">
          </div>
          <div class="col-md-2">
            <button type="submit" class="btn btn-primary form-control" id="poiSubmit">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>`);
}

/*Function to display  flight Search on HTML. The arguments expected by the function are:
1. Original Flight Search Request Object
2. Response from the API
*/
function displayFlightSearchResults(flightSearchRequest, flightSearchResult) {
  if (flightSearchResult.hasOwnProperty("errors")) {
    handleApiCallError(flightSearchResult);
  } else {
    //Store the flightSearchResult in a Global Object so that it can be referenced later.
    globalOfferStorage = [];
    //A Container is added to the HTML body which will hold all the flight results
    console.log("Adding flight search results");
    $("body").append(
      $("<div>", {
        class: "container flightSearchResults"
      })
    );

    /*The response is structured as data, dictionaries and meta
  data holds all the flight details ; dictionaries is to convert codes to user friendly text
  data --> offerItem --> services --> segments
  So looping through each offers to begin with
  */
    flightSearchResult.data.forEach(function(flightOffer, index) {
      globalOfferStorage.push({"offerId" : flightOffer.id , "offerData" : flightOffer})
      //Each offer can have "services" "price", (2 more which we are not using currently)
      flightOffer.offerItems.forEach(function(offerItems) {
        //Create a card per offer
        if (flightSearchRequest.hasOwnProperty("returnDate")){
          createCardForNewOffer(index, flightOffer.id, offerItems.price.total,"Round Trip");
        }else{
          createCardForNewOffer(index, flightOffer.id,offerItems.price.total,"One Way Trip");
        };
        //"Services" can have 2 "segments" , one for onward and one for return trip
        offerItems.services.forEach(function(services, index2) {
          createCardSegmentHeader(
            index,
            index2,
            flightSearchRequest.origin,
            flightSearchRequest.destination
          );
          // Adding a item in the card group for each leg of the trip
          // Now we are looping through to identify each segment's atttribute
          services.segments.forEach(function(segment) {
            var displayObjectForScreen = createDisplayObject(segment);
            // Adding details of each flight using a Bootstrap grid inside the card body
            showFlightDetailsOnPage(displayObjectForScreen, index);
          });
        }); 
      });
    });
  }
  console.log(globalOfferStorage);
};

//Function to gracefully handle errors from the API Call

function handleApiCallError(error) {
  console.log("Error Caught", error);
  switch (error.errors[0].source.parameter) {
    case "origin":
      var erroredParameter = "Origin";
      break;

    case "destination":
      var erroredParameter = "Destination";
      break;

    case "returnDate":
      var erroredParameter = "Return Date";
      break;

    case "departureDate":
      var erroredParameter = "Departure Date";
      break;

    case "maxPrice":
      var erroredParameter = "Max Price";
      break;

    case "adults":
      var erroredParameter = "Adults";
      break;

    case "children":
      var erroredParameter = "Children";
      break;
    case "adults, seniors, children":
      var erroredParameter = "Passengers";

    case "departureDate/returnDate":
      var erroredParameter = "Travel Dates "
  }

  switch (error.errors[0].status) {
    case 400:
      var errorMessage =
        "Oops, Looks like we hit a snag :( .. " +
        '"' +
        erroredParameter +
        '"' +
        " appears to have caused it." +
        error.errors[0].detail;
      break;

    case 404:
      var errorMessage = error.errors[0].detail;
  }

  $("body").append(
    $("<div>", {
      class: "container flightErrorMessage"
    }).append(
      $("<div>", {
        class: "card card-header offer-group error-message",
        text: errorMessage
      })
    )
  );
}

//Function to handle errors when access token is not available:
function handleAccessTokenError(data){
  console.log(displayObject.error_description);
  $("body").append(
    $("<div>", {
      class: "container flightErrorMessage"
    }).append(
      $("<div>", {
        class: "card card-header offer-group error-message",
        text: displayObject.error_description
      })
    )
  );
}



// On Click of submit

function clickSubmit() {
    
  $("body").on("click","#submitButton1",function(event){
      
      event.preventDefault();
      
      let results = {
        origin: $("#origin").val().trim(),
        destination: $("#destination").val().trim(),
        departureDate: $("#departure").val(),
        returnDate: $("#arrival").val(),
        adults: $("#Adults :selected").val(),
        children: $("#Children :selected").val(),
        travelClass: $("#class :selected").val(),
        nonStop: "false",
        //Defaulting currency and max in the API call
        currency:"CAD",
        maxPrice: $("#Price").val(),
        max: 10
      }
      
      // if the trip type is continous place true in results otherwise false in results for nonStop
      if ($("#Continous").is(":checked")) {
         results.nonStop = "true"                
       }

       
       // parse through the object and delete all empty variables. Pass those to the API flight search call
        inputFields = ["origin","destination","departureDate","returnDate","adults","children","travelClass","nonStop","currency","maxPrice"]
      
       for (i=0; i < inputFields.length; i++) {
         if (results[inputFields[i]] == null || results[inputFields[i]] == "") {
           delete results[inputFields[i]]
         }
       }
       
       //console.log(results)

      //  // Make sure Departure date, Origin and Destination are filled in
      //  var invalidEntries = ["departureDate", "origin", "destination"]
      //  var alerts = []
      //  var forAlert = "Please fill out"
      //  for (i=0; i < invalidEntries.length; i++){
      //    if (results[invalidEntries[i]]) {
      //    }
      //    else {
      //     alerts.push(invalidEntries[i])
      //    }
      //  }

      //  // Sets up the alert

      //  for (i=0; i < alerts.length; i++){
      //    if (alerts[i] === "departureDate"){
      //     alerts.splice(i, 1,"Departure Date")
      //    }
      //    else if (alerts[i] === "origin") {
      //     alerts.splice(i, 1,"Origin")
      //    }
      //    else if (alerts[i] === "destination") {
      //     alerts.splice(i, 1,"Destination")
      //    }
      //  }
       
      //  // Creates the alert

      //  for (i=0; i < alerts.length; i++) {
      //    forAlert = forAlert + " " + alerts[i]
      //  }

      //  // Performs the alert

      //  if (results["departureDate"] && results["origin"] && results["destination"]) {
      //  }
      // else {
      //   alert(forAlert)
      // }

      // // date validation. Make sure date sequence makes sense. Departure date cannot be prior to current date.
      // var currentDate = moment()
      // console.log(currentDate.diff(results["departureDate"]))
      // if (currentDate.diff(results["departureDate"]) > 0) {
      //   alert("Error: Invalid Departure Date")
      // }


       // console.log(getLowFareFlightOption(results))
       $(".flightErrorMessage").remove();
       $(".flightSearchResults").remove();
       console.log("Cleared Prev")
     getLowFareFlightOption(results).then(resp => displayFlightSearchResults(results,resp));
  })
  }

//Function to create a new card for each offer. Also iniitiates the card with a card group and its title  
function createCardForNewOffer(index, offerId, offerPrice,tripDirection) {
  $(".flightSearchResults")
    .append(
      $("<div>", {
        class: "card card-header card-title offer-group "
      })
        .append(
          $("<div>", {
            class: "row"
          })
          .append(
            $("<div>", {
              class: "col col-md-6",
              text:
                "Offer Number: " +`${index + 1}` + " ; " + tripDirection + " @ CAD " + offerPrice
            })
          )
          .append(
            $("<a>", {
              class: "col col-md-2 btn btn-primary",
              text: "Choose this one",
              id: offerId
            })
          )    
        )
        .append(
          $("<ul>", {
            class: "list-group list-group-flush",
            offerNumber: `${index}`,
          })
        )
    )
};

function createCardSegmentHeader(index, index2, origin, destination){
  if (index2 === 0) {
    var offerItemText = "Flights to:" + destination
    flightDirection = "onward";
  } else {
    var offerItemText = "Flights to:" + origin;
    flightDirection = "return";
  }

  $('[offerNumber="' + index + '"]')
  .append(
    $("<li>", {
      class: "list-group-item",
      flightdirection: flightDirection,
      text: offerItemText
    })
  );
};

function createDisplayObject(segment) {
  displayObjectForScreen = {};
  displayObjectForScreen.displayRoute =
    segment.flightSegment.departure.iataCode +
    " - " +
    segment.flightSegment.arrival.iataCode;

  displayObjectForScreen.displayDateDiff = moment(
    moment.parseZone(segment.flightSegment.arrival.at).format("YYYY-MM-DD")
  ).diff(
    moment(
      moment.parseZone(segment.flightSegment.departure.at).format("YYYY-MM-DD")
    ),
    "days"
  );

  displayObjectForScreen.displayTimings =
    moment.parseZone(segment.flightSegment.departure.at).format("HH:mm") +
    " - " +
    moment.parseZone(segment.flightSegment.arrival.at).format("HH:mm");

  var tempDuration = moment(segment.flightSegment.arrival.at).diff(
    moment(segment.flightSegment.departure.at)
  );

  displayObjectForScreen.displayDuration =
    moment.duration(tempDuration).hours() +
    "h " +
    moment.duration(tempDuration).minutes() +
    "m";

  displayObjectForScreen.displaySeatsLeft =
    segment.pricingDetailPerAdult.availability + " seats left";

  const airlineLogoUrl = "https://pics.avs.io/100/100/";
  displayObjectForScreen.displayAirlineLogo =
    airlineLogoUrl + segment.flightSegment.carrierCode + ".png";

  displayObjectForScreen.displayTravelClass = segment.pricingDetailPerAdult.travelClass;

  return displayObjectForScreen;
}


function showFlightDetailsOnPage(displayObjectForScreen, index) {
  $('[offerNumber="' + index + '"]')
    .find('[flightdirection="' + flightDirection + '"]')
    .append(
      $("<div>", {
        class: "flightSegment justify-content-md-center row"
      })
        //Show the carrier code : EK for Emirates
        .append(
          $("<div>", {
            class: "col col-sm-2"
          }).append(
            $("<img>", {
              src: displayObjectForScreen.displayAirlineLogo,
              class: "img-fluid rounded text-center"
            })
          )
        )
        //Show the route of the flight
        .append(
          $("<div>", {
            class: "col col-sm-2",
            text: displayObjectForScreen.displayRoute
          })
        )
        //Show the timings, departure and arrival
        .append(
          $("<div>", {
            class: "col col-sm-2",
            text: displayObjectForScreen.displayTimings
          }).append(
            $("<sup>", {
              class: "displaydatediff" + displayObjectForScreen.displayDateDiff,
              text: "+" + displayObjectForScreen.displayDateDiff
            })
          )
        )
        .append(
          $("<div>", {
            class: "col col-sm-2",
            text: displayObjectForScreen.displayDuration
          })
        )

        //Display the number of seats left
        .append(
          $("<div>", {
            class: "col col-sm-2",
            text: displayObjectForScreen.displaySeatsLeft
          })
        )
        //Display the class of travel
        .append(
          $("<div>", {
            class: "col col-sm-2",
            text: displayObjectForScreen.displayTravelClass
          })
        )
    );
}

//Points of Interest page validations. Disable checkboxes
function poiValidation () {
  $("body").on("click","#ten",function(){
    if ($("#ten").is(":checked"))  {
      $("#five").prop("checked", false)
    }
  })
}
  $("body").on("click","#five",function(){
    if ($("#five").is(":checked"))  {
      $("#ten").prop("checked", false)
    }
  })

