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
      return makeamadeusApiCall(data.access_token, queryString);
    })
    .catch(error => console.error(error));
}

//Iterates through the input object and forms a query string
function formQueryString(url, SearchObject) {
  let queryString = "?";
  for (var property in SearchObject) {
    queryString = `${queryString}&${property}=${SearchObject[property]}`;
  }
  console.log(url + queryString);
  return url + queryString;
}

//This function makes the actual API Call and returns the JSON response
function makeamadeusApiCall(access_token, queryString) {
  return fetch(queryString, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + access_token
    }
  })
    .then(response => response.json())
    .then(function(data) {
      return data;
    })
    .catch(error => console.error(error));
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
      return makeamadeusApiCall(data.access_token, queryString);
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

  //Variables that will only be declared once

  const goodCity = handleSpace(city);

  const myurl =
    "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=" +
    goodCity +
    "&limit=2&term=" +
    interestType +
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

    dataType: "json"
  }).then(function(response) {
    for (let i in response.businesses) {
      globalObjectslist.push({
        Name: response.businesses[i].name,

        Address: response.businesses[i].location.display_address[1],

        Img: response.businesses[i].image_url,

        Rating: response.businesses[i].rating,

        Review_Count: response.businesses[i].review_count,

        Link: response.businesses[i].url
      });
    }
  });

  //After populating response into an object (give 2 seconds for response), add poi to html
  $("#loading").removeClass("d-none");
  setTimeout(() => {
    //console.log(globalObjectslist);
    $("#loading").addClass("d-none");
    addPOI(globalObjectslist);
  }, 2000);
}

//   pointsOfinterest("Toronto");

//Function to take JSON call information and create cards to display on the webpage for each point of interest

function addPOI(listObjects) {
  console.log(listObjects);

  for (let i in listObjects) {
    $("#poiRow").append(`<div class="col-lg-6">

                                    <div class="card" style="width: 18rem;">

                                        <h5 class="card-header text-center">${
                                          listObjects[i].Name
                                        }</h5>

                                        <img src="${
                                          listObjects[i].Img
                                        }" class="card-img-top" alt="Image here for now">

                                        <div class="card-body">

                                            <p class="card-text text-center" style="font-style: italic; font-size: 75%;">Address: ${
                                              listObjects[i].Address
                                            }</p>

                                        </div>

                                        <ul class="list-group list-group-flush">

                                            <li class="list-group-item">Rating: ${
                                              listObjects[i].Rating
                                            }</li>

                                            <li class="list-group-item">Review Count: ${
                                              listObjects[i].Review_Count
                                            }</li>

                                        </ul>

                                        <div class="card-body text-center">

                                            <a href="${
                                              listObjects[i].Link
                                            }" class="card-link">Click me for more Details!</a>

                                        </div>

                                    </div>

                                 </div>`);
  }
}

// HTML dynamic loading

function restoretripPlanner(){$(".container").append(`<div class="card">
<div class="card-header">
    <h5 id="header">Flight Search</h5>
</div>
<div class="information">
    <div class="row">
        <div class="col-md-3">
            <label>Type of Flight</label>
            <select class="form" id="Nonstop">
            <option>Continous</option>
            <option>Connecting</option>
            </select>
        </div>
        
    
        <div class="col-md-2">
            <label>Class</label>
            <select class="form" id="class">
                <option>First Class</option>
                <option>Business</option>
                <option>Economy</option>
            </select>
        </div>
        <div class="col-md-2">
            <label>Adults</label>
            <select class="form" id="Adults">
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
        <div class="col-md-2">
            <label>Children</label>
            <select class="form" id="Children">
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
            <label for="exampleInputPassword1">Arrival Date</label>
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
                <button type="submit" class="btn btn-primary" id="submitButton1">Submit</button>
        </div>
    </div>
</div>
</div>`)}



function restorepointsOfInterest() {
  $(".contents").append(`<div class="card">
    <div class="card-header">
        <h5 id="cardHeader">Places to Visit!</h5>
    </div>
    <div class="card-body">
        <form>
            <div class="form-group">
                <label for="exampleInputEmail1">Destination</label>
                <input type="input" class="form-control" id="destination2"
                    aria-describedby="emailHelp" placeholder="Enter your destination please">
                <small id="emailHelp" class="form-text text-muted">Please make sure spelling is
                    correct.</small>
            </div>
            <button type="submit" class="btn btn-primary" id="submitButton2">Submit</button>
        </form>
    </div>
</div>`);
}

/*Function to display  flight Search on HTML. The arguments expected by the function are:
1. Original Flight Search Request Object
2. Response from the API
*/
function displayFlightSearchResults(flightSearchRequest, flightSearchResult) {
  //A Container is added to the HTML body which will hold all the flight results
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
    //Each offer can have "services" "price", (2 more which we are not using currently)
    flightOffer.offerItems.forEach(function(offerItems) {
      //Create a card per offer
      $(".flightSearchResults").append(
        $("<div>", {
          class: "card card-header offer-group ",
          offerNumber: `${index}`,
          text:
            "Offer Number: " +
            `${index + 1}` +
            " ; Round Trip @ CAD " +
            offerItems.price.total
        }).append(
          $("<ul>", {
            class: "list-group list-group-flush"
          })
        )
      );

      //"Services" can have 2 "segments" , one for onward and one for return trip
      offerItems.services.forEach(function(services, index2) {
        if (index2 === 0) {
          var offerItemText = "Flights to:" + flightSearchRequest.destination;
          var flightDirection = "onward";
        } else {
          var offerItemText = "Flights to:" + flightSearchRequest.origin;
          var flightDirection = "return";
        }
        // Adding a item in the card group for each leg of the trip
        $('[offerNumber="' + index + '"]')
          .children()
          .append(
            $("<li>", {
              class: "list-group-item",
              flightdirection: flightDirection,
              text: offerItemText
            })
          );
        // Now we are looping through to identify each segment's atttribute
        services.segments.forEach(function(segment) {
          var displayRoute =
            segment.flightSegment.departure.iataCode +
            " - " +
            segment.flightSegment.arrival.iataCode;

          var displayTimings =
            moment.parseZone(segment.flightSegment.departure.at).format("HH:mm") +
            " - " +
            moment.parseZone(segment.flightSegment.arrival.at).format("HH:mm");
            console.log(segment.flightSegment.departure.at , segment.flightSegment.arrival.at)

          var displayDuration = moment(segment.flightSegment.arrival.at).diff(moment(segment.flightSegment.departure.at))
          displayDuration = moment.duration(displayDuration).hours() + "h " + moment.duration(displayDuration).minutes() + "m"
          console.log(displayDuration)
          var displaySeatsLeft =
            segment.pricingDetailPerAdult.availability + " seats left";

          const airlineLogoUrl = "http://pics.avs.io/100/100/";
          var displayAirlineLogo =
            airlineLogoUrl + segment.flightSegment.carrierCode + ".png";

          // Adding details of each flight using a Bootstrap grid inside the card body
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
                      src: displayAirlineLogo,
                      class: "img-fluid rounded text-center"
                    })
                  )
                )
                //Show the route of the flight
                .append(
                  $("<div>", {
                    class: "col col-sm-2",
                    text: displayRoute
                  })
                )
                //Show the timings, departure and arrival
                .append(
                  $("<div>", {
                    class: "col col-sm-2",
                    text: displayTimings
                  })
                )
                .append(
                  $("<div>", {
                    class: "col col-sm-2",
                    text: displayDuration
                  })
                )

                //Display the number of seats left
                .append(
                  $("<div>", {
                    class: "col col-sm-2",
                    text: displaySeatsLeft
                  })
                )
                //Display the class of travel
                .append(
                  $("<div>", {
                    class: "col col-sm-2",
                    text: segment.pricingDetailPerAdult.travelClass
                  })
                )
            );
        });
      });
    });
  });
}

// On Click of submit

function clickSubmit() {
    
  $("body").on("click","#submitButton1",function(event){
      
      event.preventDefault();

      var value = $("#Nonstop :selected").val()
      
      
      let results = {
        origin: $("#origin").val().trim(),
        destination1: $("#destination").val().trim(),
        departureDate: $("#departure").val(),
        returnDate: $("#return").val(),
        adults: $("#adults :selected").val(),
        children: $("#children :selected").val(),
        travelClass: $("#class :selected").val(),
        nonStop: "False",
        //Defaulting currency and max in the API call
        //currency: $("#currency").val().trim(),
        maxPrice: $("#Price").val(),
        //max: $("#results").val().trim()
      }
      if (value === "Continous") {
         results.nonStop = "True"                
       }
  })
  }