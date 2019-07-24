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
