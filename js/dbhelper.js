/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}/restaurants`;
  }

  static get REVIEWS_URL() {
    const port = 1337
    return `http://localhost:${port}/reviews`;
  }

  static getReviews() {
    fetch(`${DBHelper.REVIEWS_URL}`)
      .then(DBHelper.handleErrors)
      .then(function(response){
        var reviews = response.json();
      })
      .then(function(review){
          reviewData = reviews;
          return reviewData;
      });
  }

/*
  static getUpdateReviews(){
    if (reviewData.length == 30){
      var request = indexedDB.open("Restaurant_Database");
      request.onsuccess = function(e){
        var db = e.target.result;
        var tx = db.transaction("Restaurant_Reviews", "readwrite");
        var store = tx.objectStore("Restaurant_Reviews");
        var storeRequest = store.getAll();
        storeRequest.onsuccess = function(){
          var reviewDatabase = storeRequest.result;
          updatedReviews = reviewDatabase;
          console.log(updatedReviews);
          return updatedReviews;
        }
      }
    }else{
      DBHelper.updateReviews();
      console.log(updatedReviews);
      return updatedReviews;
    }
    /*var p1 = new Promise( (resolve, reject) =>{
      resolve(updatedReviews);
    });
    p1.then( value => {
      console.log(value);
      return value;
    });
  }*/

  static handleErrors(response) {
      if (!response.ok) {
          throw Error(response.statusText);
      }
      console.log("response good");
      return response
    }

  static oldupdateReviews(arrayData) {
    return arrayData;
  }
  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    fetch(`${DBHelper.DATABASE_URL}`)
      .then(DBHelper.handleErrors)
      .then(function(response){
        const restaurants = response.json();
        return restaurants;
      })
      .then(function(restaurants){
            callback(null, restaurants);
      }).catch(function(restaurants){
        var request = indexedDB.open("Restaurant_Database",1);

        request.onsuccess = function(){
          var db = request.result;
          var tx = db.transaction("Restaurant_Data","readwrite");
          var store = tx.objectStore("Restaurant_Data");
          var storeRequest = store.getAll();
          storeRequest.onsuccess = function(event){
            var restaurants = storeRequest.result;
            callback(null, restaurants);
          }
        };
      });
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }
  //get alt text for image
  static altTextForImage(restaurant) {
    return (`${restaurant.name} a restaurant in New York`);
  }
  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/img/${restaurant.photograph}.jpg`);
  }

  /**
   * Map marker for a restaurant.
   */
   static mapMarkerForRestaurant(restaurant, map) {
    // https://leafletjs.com/reference-1.3.0.html#marker
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
      {title: restaurant.name,
      alt: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant)
      })
      marker.addTo(newMap);
    return marker;
  }
  /* static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  } */

}
