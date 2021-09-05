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
    var cuisineStr = '';
    if(userCuisineInput){
        cuisineStr = '&cuisineType=' + userCuisineInput;
    }
    fetch('https://api.edamam.com/api/recipes/v2?type=public&q=' + userTextInput + cuisineStr + checkboxStr + '&app_id=' + apiID + '&app_key=' + apiKey)
    .then(function(response){
        if(response.ok){
            return response.json();
        }
        else {
            alert('Error: ' + response.statusText);
        }

    })
    .then(function(response){
        // This code finds a random index out of the recipeListArr. I wanted to select 5 indexes out of the 20 that are given to us at random.  However, I didn't want to repeat the same index, so I found this method, after googling, that creates a new array with random numbers that aren't repeating(the result[]).  After we have our 5 random numbers in the array,I can change the inner HTML of recipeList to include the info out of a random Index from the JSON response. So recipeListArr[result[0]] means recipeListArr[random].
        
        var recipeListArr = response.hits;
        console.log(recipeListArr);
        let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 ,15, 16, 17, 18, 19, 20]
        let result = []
        for (let i = 0; i < 5; i++) {
            const random = Math.floor(Math.random() * (20 - i))
            result.push(arr[random]);
            arr[random] = arr[20 - i];   
        }

        var resultsEl = document.querySelector('#recipe-list');
        resultsEl.textContent = '';
        for (var i = 0; i < 5; i++) {
            var listingId = i;
            var image = recipeListArr[result[i]].recipe.image;
            var link = recipeListArr[result[i]].recipe.url;
            var name = recipeListArr[result[i]].recipe.label;
            var site = recipeListArr[result[i]].recipe.source;
            var starBtnHtml = "<span class='empty-star'><span class='iconify' data-icon='mdi:star-outline'></span></span><span class='add-star'><span class='iconify' data-icon='mdi:star-plus-outline'></span></span>";
            generateListing(listingId, image, name, site, link, resultsEl, 'fetched', starBtnHtml);
        }
    })
};

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

//   ***JOHN'S STUFF***

var loadFavorites = function(starredObj) {
    var favArray = localStorage.getItem('favArray');
    // If a favArray exists in local storage
    if (favArray) {
        // Parse & create listings based on the favArray
        favArray = JSON.parse(favArray);
        var existingFav;
        // If the recipe hasn't already been starred, add it to the favArray
        for (var i = 0; i < favArray.length; i++) {
            if (starredObj) {
                if (favArray[i].link === starredObj.link) {
                    existingFav = 'true';
                    alert('You have already added this to your favorites!');
                    break;
                }
            }
        }
        if (!existingFav) {
            if (starredObj) {
                favArray.push(starredObj)
            }
        }
    // If a favArray does NOT yet exist in local storage, create an array and add the last search
    } else { 
        favArray = [];
        if (starredObj) {
            favArray.push(starredObj)
        }
    }
    // Store updated favArray in localStorage
    localStorage.setItem('favArray', JSON.stringify(favArray));
    // Clear previous favorites
    var favoritesEl = document.querySelector('#favorites-container');
    favoritesEl.textContent = '';
    // Add back favorites based on updated array
    for (var i = 0; i < favArray.length; i++) {
        var listingId = i;
        var image = favArray[i].image;
        var link = favArray[i].link;
        var name = favArray[i].name;
        var site = favArray[i].site;
        var starBtnHtml = "<span class='full-star'><span class='iconify' data-icon='mdi:star'></span></span><span class='remove-star'><span class='iconify' data-icon='mdi:star-remove'></span></span>";
        generateListing(listingId, image, name, site, link, favoritesEl, 'favorite', starBtnHtml);
    }
}

var generateListing = function(listingId, image, name, site, link, parentDiv, className, starBtnHtml) {
    var recipeListingEl = document.createElement('article');
    recipeListingEl.classList = className + '-recipe';
    recipeListingEl.setAttribute('data-' + className + '-id', listingId);
    var imgDiv = document.createElement('div');
    imgDiv.classList = 'recipe-img';
    var recipeImgLink = document.createElement('a');
    recipeImgLink.setAttribute('href', link);
    recipeImgLink.setAttribute('target', '_blank');
    var recipeImg = document.createElement('img');
    recipeImg.setAttribute('src', image);
    recipeImg.setAttribute('alt', name);
    var dataDiv = document.createElement('div');
    dataDiv.classList = 'recipe-data';
    var recipeLink = document.createElement('a');
    recipeLink.setAttribute('href', link);
    recipeLink.setAttribute('target', '_blank');
    var recipeName = document.createElement('h3');
    recipeName.textContent = name;
    var recipeSite = document.createElement('p');
    recipeSite.textContent = site;
    recipeSite.classList = 'website-name';
    var starDiv = document.createElement('div');
    starDiv.classList = className + '-star';
    var starBtn = document.createElement('button');
    starBtn.classList = className;
    starBtn.innerHTML = starBtnHtml;

    starDiv.appendChild(starBtn);

    recipeImgLink.appendChild(recipeImg);
    imgDiv.appendChild(recipeImgLink);

    recipeLink.appendChild(recipeName);
    recipeLink.appendChild(recipeSite);
    dataDiv.appendChild(recipeLink);

    recipeListingEl.appendChild(imgDiv);
    recipeListingEl.appendChild(dataDiv);
    recipeListingEl.appendChild(starDiv);
    parentDiv.appendChild(recipeListingEl);
}

  var starClickHandler = function(event) {
        var recipeId = event.target.closest('.recipe').getAttribute('data-id');
        console.log('You have starred Recipe #' + recipeId);
        var recipeUrl = document.querySelector("article[data-id='" + recipeId + "'] div.recipe-img a").getAttribute('href');
        var recipeImg = document.querySelector("article[data-id='" + recipeId + "'] div.recipe-img a img").getAttribute('src');
        var recipeName = document.querySelector("article[data-id='" + recipeId + "'] div.recipe-data a h3").textContent;
        var recipeSite = document.querySelector("article[data-id='" + recipeId + "'] div.recipe-data a p").textContent;
        var starredObj = { 'name': recipeName, 'site': recipeSite, 'image': recipeImg, 'link': recipeUrl};
        event.target.closest('.fetched-star button').innerHTML = "<span class='iconify' data-icon='mdi:star'></span>";
        loadFavorites(starredObj);
    }

    var favClickHandler = function(event) {
        debugger;
        var recipeId = event.target.closest('.favorite-recipe').getAttribute('data-favorite-id');
        console.log('You have removed Recipe #' + recipeId + ' from the array.');
        var favArray = JSON.parse(localStorage.getItem('favArray'));
        favArray.splice(recipeId, 1);
        localStorage.setItem('favArray', JSON.stringify(favArray));
        localStorage.setItem('starred', '');
        loadFavorites();
        favoritesListener();
    }

function resultsListener() {
  var stars = document.querySelectorAll('.fetched-star');
  console.log(stars);
  stars.forEach(el => el.addEventListener('click', starClickHandler));
}

function favoritesListener() {
  var favorites = document.querySelectorAll('.favorite-star');
  console.log(favorites)
  favorites.forEach(el => el.addEventListener('click', favClickHandler));
}

loadFavorites();

resultsListener();
favoritesListener();