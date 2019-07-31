var firebaseConfig = {
  apiKey: "AIzaSyDUX9DVTMc8Ptab-HNqS67Aaa4Q03tTKY0",
  authDomain: "travel-planner-5ee92.firebaseapp.com",
  databaseURL: "https://travel-planner-5ee92.firebaseio.com",
  projectId: "travel-planner-5ee92",
  storageBucket: "travel-planner-5ee92.appspot.com",
  messagingSenderId: "801115572936",
  appId: "1:801115572936:web:ca663426e49dc5fb"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

console.log("Connected to Firebase");

$(document).ready(function() {
  $("body").on("click", ".flightChoice", function() {
    console.log("Clicked Flight choice " + $(this).attr("id"));
    var selectedOffer = $(this).attr("id");
    var currentState = $(this).attr("state");

    if (currentState === "not-selected") {
      $(`#${selectedOffer}`).addClass("btn-success");
      $(`#${selectedOffer}`).removeClass("btn-primary");
      $(`#${selectedOffer}`).text("Selected");
      $(`#${selectedOffer}`).attr("state", "selected");
      globalOfferStorage.forEach(function(offer) {
        if (offer.offerId == selectedOffer) {
          console.log(offer.offerData);
          database
            .ref("/selectedFlights")
            .push()
            .set({
              offerId: offer.offerId,
              offerData: offer.offerData
            });
        }
      });
    }else{
        $(`#${selectedOffer}`).removeClass("btn-success");
        $(`#${selectedOffer}`).addClass("btn-primary");
        $(`#${selectedOffer}`).text("Choose This One");
        $(`#${selectedOffer}`).attr("state", "not-selected");

        database
        .ref("/selectedFlights")
        .orderByChild("offerId")
        .equalTo(selectedOffer)
        .once("value", function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
              childSnapshot.ref.remove();
            });
          });
          }
  });
});
