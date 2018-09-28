let restaurant;
let reviews;
var newMap;

/*function getReviewsJSON(){
      fetch(`${DBHelper.REVIEWS_URL}`)
        .then(DBHelper.handleErrors)
        .then(function(response){
            var reviews = response.json();
            return reviews;
        })
        .then(function(review){
          reviewData = review;
          //caches.open('offline').then(function(cache){cache.add(`${DBHelper.REVIEWS_URL}`)});
          console.log(reviewData);
          return reviewData
        });
}
getReviewsJSON();
*/

/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  initMap();
});

/**
 * Initialize leaflet map
 */
initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.newMap = L.map('map', {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
        zoom: 16,
        scrollWheelZoom: false
      });
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
        mapboxToken: 'pk.eyJ1IjoiYWNlaW5mZXJubyIsImEiOiJjaml0Z2VieGQxcmtkM3F0OWZoZm55eWk2In0.0nk8bYeRIAGfw7HksXOQKQ',
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
      }).addTo(newMap);
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
    }
  });
}

/* window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
} */

/*function getReviews() {
  fetch(`${DBHelper.REVIEWS_URL}`)
    .then(DBHelper.handleErrors)
    .then(function(response){
      const reviews = response.json();
      return reviews;
    })
    .then(function(review){
        reviewData = review;
    });
    return reviewData;
}*/
function getNewReviews(){
  const database = new XMLHttpRequest();
  database.open('GET', DBHelper.REVIEWS_URL);
  database.onload = handleSuccess;
  database.onerror = handleError;
  database.send();
}
function handleSuccess () {
  const json = JSON.parse(this.responseText);
  reviewData = json;
  return reviewData;
}
function handleError () {
  console.log( 'An error occurred' );
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img'
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.alt = DBHelper.altTextForImage(restaurant);

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
 fillReviewsHTML = (restaurantInfo = self.restaurant) => {
   const container = document.getElementById('reviews-container');
   const title = document.createElement('h2');
   title.innerHTML = 'Reviews';
   container.appendChild(title);

   fetch(`http://localhost:1337/reviews/?restaurant_id=${self.restaurant.id}`)
    .then(DBHelper.handleErrors)
    .then(function(response){
      var reviews = response.json();
      return reviews;
    })
    .then(function(reviews){
      reviewData = reviews;
      console.log(reviewData);
      if (!reviewData) {
        const noReviews = document.createElement('p');
        noReviews.innerHTML = 'No reviews yet!';
        container.appendChild(noReviews);
        return;
      }
      const ul = document.getElementById('reviews-list');
      reviews.forEach(review => {
        ul.appendChild(createReviewHTML(review));
      });
      container.appendChild(ul);
    })
    .catch(function(){
      var request = indexedDB.open("Restaurant_Database");
      request.onsuccess = function(e){
        var db = e.target.result;
        var tx = db.transaction("Restaurant_Reviews", "readwrite");
        var store = tx.objectStore("Restaurant_Reviews");
        var storeRequest = store.getAll();
        storeRequest.onsuccess = function(){
          var reviewDatabase = storeRequest.result;
          var storeReviews = []
          for(i=0;i<reviewDatabase.length;i++){
            if(restaurantInfo.id == reviewDatabase[i].restaurant_id){
              storeReviews.push(reviewDatabase[i]);
            }
          }
          console.log(storeReviews);
          if (!storeReviews) {
            const noReviews = document.createElement('p');
            noReviews.innerHTML = 'No reviews yet!';
            container.appendChild(noReviews);
            return;
          }
          const ul = document.getElementById('reviews-list');
          storeReviews.forEach(review => {
            ul.appendChild(createReviewHTML(review));
          });
          container.appendChild(ul);
      }
    };
 });
}
/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.innerHTML = review.name;
  li.appendChild(name);

  const reviewDate = document.createElement('p');
  var d = new Date(review.updatedAt);
  reviewDate.innerHTML = d.toDateString();
  li.appendChild(reviewDate);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
