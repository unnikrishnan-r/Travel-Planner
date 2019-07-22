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

//Invoking the function to retreive access token ; below should be included before all api calls
//Uncomment to test this function
// getAccessToken()
//   .then(data => console.log("Access token : " + data.access_token))
//   .catch(error => console.error(error));
