// Edamam api info
var apiID = 'a65ff64e';
var apiKey = 'be6264a5a45b927edcca5d188d013025';

// YouTube API info

var nickYtApiKey = 'AIzaSyAUT7vv2wxNeq7foqQDoHXaonN67hFemOs';
var seanYtApiKey = 'AIzaSyAFrdBZ18oQzxQEt3n9K_era03MHQ88F18';

// Grabbing youtube container

var ytContainer = document.getElementById('youtube-container');


// DOM Selectors for Search Field
var searchBtn = document.getElementById('searchBtn');
var resetBtn = document.getElementById('resetBtn');

// DOM Selectors for Recipelist
var recipeList = document.getElementById('recipe-list');

// DOM Selectors for Modals
var modal = document.getElementById('modalBox');
var modalClose = document.getElementsByClassName('close')[0];
var modalText = document.getElementById('modal-text');

// Modal render function 
function modalRender() {
    modalClose.onclick = function() {
        modal.style.display = "none";
      }
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }
}


// Event listener to make sure text field is filled
searchBtn.addEventListener('click', function(event){
    event.preventDefault();
    var userTextInput = document.getElementById('nameField').value;

    if(userTextInput === ''){
        modal.style.display = 'block';
        modalText.innerHTML = 'Please enter an ingredient/recipe in the search field!'
        modalRender();
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
            modal.style.display = 'block';
            modalText.innerHTML = 'Error: ' + response.statusText;
            modalRender();
        }

    })
    .then(function(response){
        var recipeListArr = response.hits;
        console.log(recipeListArr);

        // If there are no results
        if(recipeListArr === undefined || recipeListArr.length == 0){
            modal.style.display = 'block';
            modalText.innerHTML = 'Your search did not retrieve any results, please try again!';
            modalRender();
            return;
        }
        
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
        // Create h2 section header
        var resultsHeading = document.createElement('h2');
            resultsHeading.textContent = 'Recipe List...';
            resultsEl.appendChild(resultsHeading);
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
        return fetch('https://www.googleapis.com/youtube/v3/search?part=snippet&key=' + seanYtApiKey + '&q=' + userCuisineInput + ' ' + userTextInput + checkboxStr.replace(/&health=/g, ' ') + ' recipe' + '&type=video&videoEmbeddable=true')
    })
    .then(function(youtuberesponse){
        if(youtuberesponse === undefined){
            return;
        }
        if(youtuberesponse.ok){
            return youtuberesponse.json();
        }
        else{
            modal.style.display = 'block';
            modalText.innerHTML = 'Error: ' + youtuberesponse.statusText;
            modalRender();
        }
             
    })
    .then(function(youtuberesponse){
        if(youtuberesponse === undefined){
            return;
        }
        // Sets inner html of parent to remove previous video list.
        ytContainer.innerHTML = '';
        // Create h2 section header
        var videoHeading = document.createElement('h2');
            videoHeading.textContent = 'Video Inspiration...';
            ytContainer.appendChild(videoHeading);
        // selecting the arr that holds the 5 videos from the search
        var videoIdArr = youtuberesponse.items;
        // For each index, select the videoId, create a yt embed iframe, place the id into the iframe, and append each iframe.
        let i = 0;
        videoIdArr.forEach(function(elem, i){
            var ytId = videoIdArr[i].id.videoId;
            var ytIframe = document.createElement('iframe');
            ytIframe.setAttribute('src', 'https://www.youtube.com/embed/' + ytId);
            ytIframe.setAttribute('title', 'YouTube Video Player');
            ytIframe.setAttribute('frameborder', '0');
            ytIframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            ytContainer.appendChild(ytIframe);
            console.log(ytId);
        })

    })
};

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
    // Create h2 section header
    if (favArray.length === 0) {
        return;
    } else {
        var favHeading = document.createElement('h2');
        favHeading.textContent = 'Your Favorites...';
        favoritesEl.appendChild(favHeading);
    };
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
