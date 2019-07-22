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
    getAccessToken()
        .then(function (data) {
            const access_token = data.access_token;
            searchForFlights(access_token, queryString);
        })
        .catch(error => console.error(error));
}

//Iterates through the input object and forms a query string
function formQueryString(url, flightSearchObject) {
    let queryString = "?"
    for (var property in flightSearchObject){
        queryString = `${queryString}&${property}=${flightSearchObject[property]}`
    }
    console.log(url+queryString);
    return (url+queryString);
}

//This function makes the actual API Call and returns the JSON response
function searchForFlights(access_token, queryString) {
    return fetch(queryString, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + access_token
            }
        })
        .then(response => response.json())
        .then(function (data) {
            console.log(data);
            return data;
        })
        .catch(error => console.error(error));
}

//Here is a sample call for the Search Flights operation
getLowFareFlightOption({
    origin: "YYZ",
    destination: "COK",
    departureDate: "2019-09-01",
    returnDate: "2019-10-01",
    adults: 2,
    children: 2,
    travelClass: "ECONOMY",
    nonStop: "false",
    currency: "CAD",
    maxPrice: 50000,
    max: 3
});