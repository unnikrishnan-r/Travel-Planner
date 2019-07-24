//Sample call for getIataCodeUsingCityName
getAirportCodeUsingCityName("london").then(res =>
  console.log(res.data[0].iataCode)
);

// Here is a sample call for the Search Flights operation
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
}).then(resp => console.log(resp));
