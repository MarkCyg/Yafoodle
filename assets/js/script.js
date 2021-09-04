// Edamam api info
var apiID = 'a65ff64e';
var apiKey = 'be6264a5a45b927edcca5d188d013025';

// DOM Selectors for Search Field
var searchBtn = document.getElementById('searchBtn');
var resetBtn = document.getElementById('resetBtn');


// Event listener to make sure text field is filled
searchBtn.addEventListener('click', function(event){
    event.preventDefault();
    var userTextInput = document.getElementById('nameField').value;

    if(userTextInput === ''){
        alert('Please enter a food item!')
    }
    else{
        recipeFetch();
    }
});


// Edamam fetch request.  Selects DOM elements in the form.
function recipeFetch(){
    var userTextInput = document.getElementById('nameField').value;
    var userCuisineInput = document.getElementById('cuisineField').value;

    // For Each function pushes parameter for API and the value of the check box to an array.  turn the array into a string with join() 
    var checkboxArr = [];
    document.querySelectorAll('.confirmField').forEach((elem) => { 
        if(elem.checked){
            checkboxArr.push('&health=' + elem.value);
    }
    }) 
    var checkboxStr = checkboxArr.join('');
    // fills api with a string if there us a user input for cusine type
    var cusineStr = '';
    if(userCuisineInput){
        cusineStr = '&cuisineType=' + userCuisineInput;
    }
    fetch('https://api.edamam.com/api/recipes/v2?type=public&q=' + userTextInput + cusineStr + checkboxStr + '&app_id=' + apiID + '&app_key=' + apiKey)
    .then(function(response){
        if(response.ok){
            console.log(response);
            return response.json();
        }
        else {
            alert('Error: ' + response.statusText);
        }
         
    })   
};


// recipeFetch();

function openCity(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById().style.display = "block";
    evt.currentTarget.className += " active";
  }
