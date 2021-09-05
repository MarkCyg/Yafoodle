// Edamam api info
var apiID = 'a65ff64e';
var apiKey = 'be6264a5a45b927edcca5d188d013025';

// DOM Selectors for Search Field
var searchBtn = document.getElementById('searchBtn');
var resetBtn = document.getElementById('resetBtn');

// DOM Selectors for Recipelist
var recipeList = document.getElementById('recipe-list');

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

    // fills api with a string if there is a user input for cusine type
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
    .then(function(response){
        // This code finds a random index out of the recipeListArr. I wanted to select 5 indexes out of the 20 that are given to us at random.  However, I didn't want to repeat the same index, so I found this method, after googling, that creates a new array with random numbers that aren't repeating(the result[]).  After we have our 5 random numbers in the array,I can change the inner HTML of recipeList to include the info out of a random Index from the JSON response. So recipeListArr[result[0]] means recipeListArr[random].
        
        var recipeListArr = response.hits;
        let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 ,15, 16, 17, 18, 19, 20]
        let result = []
        for (let i = 0; i < 5; i++) {
            const random = Math.floor(Math.random() * (20 - i))
            result.push(arr[random]);
            arr[random] = arr[20 - i];   
        }
        recipeList.innerHTML = '<li>' + recipeListArr[result[0]].recipe.label + '</li> <li>' +  recipeListArr[result[1]].recipe.label + '</li> <li>' +  recipeListArr[result[2]].recipe.label + '</li> <li>' +  recipeListArr[result[3]].recipe.label + '</li> <li>' +  recipeListArr[result[4]].recipe.label + '</li>';

    })
};



// recipeFetch();

