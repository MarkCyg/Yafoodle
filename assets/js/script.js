// Edamam api info
var apiID = 'a65ff64e';
var apiKey = 'be6264a5a45b927edcca5d188d013025';

// YouTube API info

var ytApiKey = 'AIzaSyAUT7vv2wxNeq7foqQDoHXaonN67hFemOs';

// Hiding youtube container

var ytContainer = document.getElementById('youtube-container');
ytContainer.style.display = 'none';

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
        //  ***TEMP***
            alert('Error: ' + response.statusText);
        }

    })
    .then(function(response){
        // ***PREVIOUS CODE***
        // This code finds a random index out of the recipeListArr. I wanted to select 5 indexes out of the 20 that are given to us at random.  However, I didn't want to repeat the same index, so I found this method, after googling, that creates a new array with random numbers that aren't repeating(the result[]).  After we have our 5 random numbers in the array,I can change the inner HTML of recipeList to include the info out of a random Index from the JSON response. So recipeListArr[result[0]] means recipeListArr[random].
        // let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 ,15, 16, 17, 18, 19]
        // let result = []
        // for (let i = 0; i < 5; i++) {
        //     const random = Math.floor(Math.random() * (19 - i))
        //     result.push(arr[random]);
        //     arr[random] = arr[19 - i];   
        // }
        // ***END***

        var recipeListArr = response.hits;
        console.log(recipeListArr);

        // if less than 5 results, only iterate the length of the recipeListArr
        var displayNumber = 5
        if (recipeListArr.length < 5) {
            displayNumber = recipeListArr.length
        }
        console.log('displayNumber = ' + displayNumber);

        // Create an array of numbers which matches the length of the recipeListArr (20 max | values: 0-19)
        let numberArr = []
        for (let i = 0; i < recipeListArr.length; i++) {
            numberArr.push(i);
        }

        // Create an array of unique random numbers pulled from the numberArr. Determine its length by displayNumber.
        let randomResults = []
        for (let i = 0; i < displayNumber; i++) {
            const random = Math.floor(Math.random() * ((recipeListArr.length - 1) - i));
            randomResults.push(numberArr[random]);
            // Remove the selected number from the numberArr to avoid duplication in randomResults
            numberArr.splice(random, 1);
        }
        console.log(randomResults);
        
        // Remove any previous content from #recipe-list
        var resultsEl = document.querySelector('#recipe-list');
        resultsEl.textContent = '';
        // Generate listings on the page; choose recipes based on randomResults array
        for (var i = 0; i < displayNumber; i++) {
            var listingId = i;
            var image = recipeListArr[randomResults[i]].recipe.image;
            var link = recipeListArr[randomResults[i]].recipe.url;
            var name = recipeListArr[randomResults[i]].recipe.label;
            var site = recipeListArr[randomResults[i]].recipe.source;
            var starBtnHtml = "<span class='empty-star'><span class='iconify' data-icon='mdi:star-outline'></span></span><span class='add-star'><span class='iconify' data-icon='mdi:star-plus-outline'></span></span>";
            generateListing(listingId, image, name, site, link, resultsEl, 'fetched', starBtnHtml);
        }
        return fetch('https://www.googleapis.com/youtube/v3/search?part=snippet&key=' + ytApiKey + '&q=' + userCuisineInput + ' ' + userTextInput + checkboxStr.replace(/&health=/g, ' '))
    })
    .then(function(youtuberesponse){
        console.log(youtuberesponse);
        return youtuberesponse.json();     
    })
    .then(function(youtuberesponse){
        var videoIdArr = youtuberesponse.items;
        let i = 0;
        videoIdArr.forEach(function(elem, i){
            var ytId = videoIdArr[i].id.videoId;
            var ytIframe = document.createElement('iframe');
            ytIframe.setAttribute(elem, {'src': 'https://www.youtube.com/embed/' + ytId, 'title': 'YouTube Video Player', 'frameborder': '0', 'allow': 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'});
            });     
    })};

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
        var recipeId = event.target.closest('.fetched-recipe').getAttribute('data-fetched-id');
        console.log('You have starred Recipe #' + recipeId);
        var recipeUrl = document.querySelector("article[data-fetched-id='" + recipeId + "'] div.recipe-img a").getAttribute('href');
        var recipeImg = document.querySelector("article[data-fetched-id='" + recipeId + "'] div.recipe-img a img").getAttribute('src');
        var recipeName = document.querySelector("article[data-fetched-id='" + recipeId + "'] div.recipe-data a h3").textContent;
        var recipeSite = document.querySelector("article[data-fetched-id='" + recipeId + "'] div.recipe-data a p").textContent;
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

loadFavorites();

addDynamicEventListener(document.body, 'click', '.fetched-star', function (e) {
    starClickHandler(e);
});

addDynamicEventListener(document.body, 'click', '.favorite-star', function (e) {
    favClickHandler(e);
});
