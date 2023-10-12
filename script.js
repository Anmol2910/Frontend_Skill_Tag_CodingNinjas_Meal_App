// Initialize a favorites meal array if it doesn't exist in local storage
if (localStorage.getItem("favouritesList") == null) {
    localStorage.setItem("favouritesList", JSON.stringify([]));
}

// Asynchronously fetch meals from the API and return the data
async function fetchMealsFromApi(url, value) {
    const response = await fetch(`${url + value}`);
    const meals = await response.json();
    return meals;
}

function showAllMeals() {
    let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    let html = "";
    fetchMealsFromApi(url, "").then(data => {
        if (data.meals) {
            data.meals.forEach((element) => {
                html += `
                    <div id="card" class="card mb-3" style="width: 20rem;">
                        <!-- Meal image and details -->
                        <img src="${element.strMealThumb}" class="card-img-top" alt="...">

                        <!-- Heart icon to add/remove from favorites -->

                        <div class="card-body">
                            <h5 class="card-title">${element.strMeal}</h5>
                            <div class="d-flex justify-content-between mt-5">
                                <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${element.idMeal})">More Details</button>
                                <button id="main${element.idMeal}" class="btn btn-outline-light" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                            </div>
                        </div>
                    </div>
                `;
            });
        } else {
            // No meals found, display a "Not Found" message
            html += `
            <div class="page-wrap d-flex flex-row align-items-center">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-12 text-center">
                        <span class="display-1 d-block">404</span>
                        <div class="mb-4 lead">
                            The meal you are looking for was not found.
                        </div>
                    </div>
                </div>
            </div>
        </div>
            `;
        }
        document.getElementById("main").innerHTML = html;
    });
}

// Call the function to display all meals when the page is initially loaded
showAllMeals();

// Display a list of meals in the main section based on the search input value
function showMealList() {
    let inputValue = document.getElementById("my-search").value;
    let arr = JSON.parse(localStorage.getItem("favouritesList"));
    let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    let html = "";
    let meals = fetchMealsFromApi(url, inputValue);
    meals.then(data => {
        if (data.meals) {
            data.meals.forEach((element) => {
                let isFav = false;
                for (let index = 0; index < arr.length; index++) {
                    if (arr[index] == element.idMeal) {
                        isFav = true;
                    }
                }
                if (isFav) {
                    // Meal is in favorites, display with a heart icon
                    html += `
                <div id="card" class="card mb-3" style="width: 20rem;">
                <!-- Meal image and details -->
                    <img src="${element.strMealThumb}" class="card-img-top" alt="...">

                    <!-- Heart icon to add/remove from favorites -->

                    <div class="card-body">
                        <h5 class="card-title">${element.strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${element.idMeal})">More Details</button>
                            <button id="main${element.idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                </div>
                `;
                    // Meal is not in favorites, display without the heart icon
                } else {
                    html += `
                <div id="card" class="card mb-3" style="width: 20rem;">
                <!-- Meal image and details -->
                    <img src="${element.strMealThumb}" class="card-img-top" alt="...">

                    <!-- Heart icon to add/remove from favorites -->

                    <div class="card-body">
                        <h5 class="card-title">${element.strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${element.idMeal})">More Details</button>
                            <button id="main${element.idMeal}" class="btn btn-outline-light" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                </div>
                `;
                }
            });
        } else {
            // No meals found, display a "Not Found" message
            html += `

            <!-- Display a "Not Found" message -->

            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
                            <span class="display-1 d-block">404</span>
                            <div class="mb-4 lead">
                                The meal you are looking for was not found.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }
        document.getElementById("main").innerHTML = html;
    });
}


// Display full meal details in the main section
async function showMealDetails(id) {
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";
    await fetchMealsFromApi(url, id).then(data => {
        html += `
          <div id="meal-details" class="mb-5">
            <div id="meal-header" class="d-flex justify-content-around flex-wrap">
              <div id="meal-thumbail">
                <img class="mb-2" src="${data.meals[0].strMealThumb}" alt="" srcset="">
              </div>
              <div id="details">
                <h3>${data.meals[0].strMeal}</h3>
                <h6>Category : ${data.meals[0].strCategory}</h6>
                <h6>Area : ${data.meals[0].strArea}</h6>
              </div>
            </div>
            <div id="meal-instruction" class="mt-3">
              <h5 class="text-center">Instruction :</h5>
              <p>${data.meals[0].strInstructions}</p>
            </div>
            <div class="text-center">
              <a href="${data.meals[0].strYoutube}" target="_blank" class="btn btn-outline-light mt-3">Watch Video</a>
            </div>
          </div>
        `;
    });
    document.getElementById("main").innerHTML = html;
}


// Display all favorite meals in the favorites section
async function showFavMealList() {
    let arr = JSON.parse(localStorage.getItem("favouritesList"));
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";
    if (arr.length == 0) {
        // No favorites, display a message
        html += `

        <!-- Display a message for empty favorites -->

            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
                            <span class="display-1 d-block">404</span>
                            <div class="mb-4 lead">
                                No meal added in your favourites list.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
    } else {
        // Display favorite meals with details

        for (let index = 0; index < arr.length; index++) {
            await fetchMealsFromApi(url, arr[index]).then(data => {
                html += `
                <div id="card" class="card mb-3" style="width: 20rem;">

                <!-- Meal image and details -->
                    <img src="${data.meals[0].strMealThumb}" class="card-img-top" alt="...">

                    <!-- Heart icon to add/remove from favorites -->

                    <div class="card-body">
                        <h5 class="card-title">${data.meals[0].strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${data.meals[0].idMeal})">More Details</button>
                            <button id="main${data.meals[0].idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${data.meals[0].idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                </div>
                `;
            });
        }
    }
    document.getElementById("favourites-body").innerHTML = html;
}


// Add or remove meals to/from the favorites list
function addRemoveToFavList(id) {
    let arr = JSON.parse(localStorage.getItem("favouritesList"));
    let contain = false;
    for (let index = 0; index < arr.length; index++) {
        if (id == arr[index]) {
            contain = true;
        }
    }
    if (contain) {
        // Meal is in favorites, remove it
        // Display a removal alert
        let number = arr.indexOf(id);
        arr.splice(number, 1);
        alert("your meal removed from your favourites list");
    } else {
        // Meal is not in favorites, add it
        // Display an add alert
        arr.push(id);
        alert("your meal add your favourites list");
    }
    // Update local storage and refresh both meal lists
    localStorage.setItem("favouritesList", JSON.stringify(arr));
    showMealList();
    showFavMealList();
}
