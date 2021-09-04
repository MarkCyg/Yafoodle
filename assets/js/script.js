// Edamam api info
var apiID = 'a65ff64e';

var apiKey = 'be6264a5a45b927edcca5d188d013025'

function recipeFetch(){
    fetch('https://api.edamam.com/api/recipes/v2?type=public&q=cuisineType=&app_id=' + apiID + '&app_key=' + apiKey)
    .then(function(response){
        if(response.ok){
            console.log(response);
            return response.json();
        }
        else {
            alert('Error: ' + response.statusText);
        }
         
    })
    
}

function youtubeFetch(){
    fetch('https://www.googleapis.com/youtube/v3/search?part=snippet')
}


recipeFetch();

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