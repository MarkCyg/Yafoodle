// Edamam api info
var apiID = 'a65ff64e';

var apiKey = 'be6264a5a45b927edcca5d188d013025'

function recipeFetch(){
    fetch('https://api.edamam.com/api/recipes/v2?type=public&q=broccoli&cuisineType=italian&app_id=' + apiID + '&app_key=' + apiKey + '&health=vegan')
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