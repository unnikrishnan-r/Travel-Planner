// On click function of submit button

function clickSubmit() {
    
$("body").on("click","#submitButton1",function(event){
    
    event.preventDefault();

    let results = {
        origin: $("#origin").val().trim(),
        destination1: $("#destination").val().trim(),
        departureDate: $("#departure").val().trim(),
        returnDate: $("#return").val().trim(),
        adults: $("#adults").val().trim(),
        children: $("#children").val().trim(),
        travelClass: $("#class").val().trim(),
        nonStop: $("#nonStop").val().trim(),
        currency: $("#currency").val().trim(),
        maxPrice: $("#maxPrice").val().trim(),
        max: $("#results").val().trim()
    }
})
}

//-------------------------------------CODE --------------------------------------
restoretripPlanner() 

restorepointsOfInterest()

clickSubmit()



