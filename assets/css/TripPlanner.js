function restoretripPlanner(){$(".content").append(`<div class="card"><div class="card-header"><h5 id="card-header">Flight Search</h5></div><div class="card-body"><form>
<div class="form-group">
    <label for="exampleInputEmail1" id="heading">Origin</label>
    <input type="input" class="form-control" id="origin"
        aria-describedby="emailHelp" placeholder="Enter your origin please">
    <small id="emailHelp" class="form-text text-muted">Please make sure spelling is
        correct.</small>
</div>
<div class="form-group">
    <label for="exampleInputEmail1">Destination</label>
    <input type="input" class="form-control" id="destination"
        aria-describedby="emailHelp" placeholder="Enter your destination please">
    <small id="emailHelp" class="form-text text-muted">Please make sure spelling is
        correct.</small>
</div>
<div class="form-group">
    <label for="exampleInputPassword1">Departure Date</label>
    <input type="date" class="form-control" id="departure"
        placeholder="YYYY/MM/DD">
</div>
<div class="form-group" id="mango">
    <label for="exampleInputPassword1">Return Date</label>
    <input type="date" class="form-control" id="return"
        placeholder="YYYY/MM/DD">
</div>
<div class="form-group">
    <label for="exampleInputPassword1">Number of Adults</label>
    <input type="input" class="form-control" id="adults"
        placeholder="Number of passengers (Optional)">
</div>
<div class="form-group">
    <label for="exampleInputPassword1">Number of Children</label>
    <input type="input" class="form-control" id="children"
        placeholder="Number of passengers (Optional)">
</div>
<div class="form-group">
    <label for="exampleInputPassword1">Max Price</label>
    <input type="input" class="form-control" id="max"
        placeholder="Enter a number (Optional)">
</div>
<div class="form-group">
    <label for="exampleInputPassword1">Travel Class</label>
    <input type="input" class="form-control" id="class"
        placeholder="First Class?">
</div>
<div class="form-group">
    <label for="exampleInputPassword1">Non-Stop?</label>
    <input type="input" class="form-control" id="nonStop"
        placeholder="Non Stop?">
</div>
<div class="form-group">
    <label for="exampleInputPassword1">Currency</label>
    <input type="input" class="form-control" id="currency"
        placeholder="Currency">
</div>
<div class="form-group">
    <label for="exampleInputPassword1">Max Price</label>
    <input type="input" class="form-control" id="maxPrice"
        placeholder="Max Price">
</div>
<div class="form-group">
    <label for="exampleInputPassword1">Results</label>
    <input type="input" class="form-control" id="results"
        placeholder="How Many Results do you want to see?">
</div>
<button type="submit" class="btn btn-primary" id="submitButton1">Submit</button>
</form></div></div>`)}

function restorepointsOfInterest(){

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
</div>`)}

function overwriteTripPlanner() {
$(".content").empty();
}

function overwritepointsOfInterest() {
    $(".contents").empty();
}

var origin 
var destination1
var destination2
var departureDate
var returnDate
var adults
var children
var travelClass
var nonStop
var currency
var maxPrice
var max

//-------------------------------------CODE --------------------------------------
restoretripPlanner() 

restorepointsOfInterest()

$("body").on("click","#submitButton1",function(event){
    
    event.preventDefault();
    
    origin = $("#origin").val().trim()
    destination1 = $("#destination").val().trim()
    departureDate = $("#departure").val().trim()
    returnDate = $("#return").val().trim()
    adults = $("#adults").val().trim()
    children = $("#children").val().trim()
    travelClass = $("#class").val().trim()
    nonStop = $("#nonStop").val().trim()
    currency = $("#currency").val().trim()
    maxPrice = $("#maxPrice").val().trim()
    max = $("#results").val().trim()
    overwriteTripPlanner()
})

$("body").on("click","#submitButton2", function(event){
    event.preventDefault();

    destination2 = $("#destination2").val().trim()
    overwritepointsOfInterest()
})
