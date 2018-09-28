var restaurantData;
var reviewData;

  function getRestaurantJSON(){
    const database = new XMLHttpRequest();
    database.open('GET', DBHelper.DATABASE_URL);
    database.onload = handleSuccess;
    database.onerror = handleError;
    database.send();
  }
  function handleSuccess () {
    const json = JSON.parse(this.responseText);
    caches.open('offline').then(function(cache){cache.add(`${DBHelper.DATABASE_URL}`)});
    restaurantData = json;
    console.log(restaurantData);
  }
  function handleError () {
    console.log( 'An error occurred' );
  }
  getRestaurantJSON();

  function getReviewsJSON(){
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

  function createRestaurantsIDB(){
    const dbName = "Restaurant_Database";
    const request = indexedDB.open(dbName);
    request.onupgradeneeded = function (event) {
        var db = event.target.result;
        var objStore = db.createObjectStore("Restaurant_Data", { autoIncrement : true });
        restaurantData.forEach(function(restaurant) {
            objStore.add(restaurant);
        });
    };
  }
  createRestaurantsIDB();
  function createReviewsIDB(){
    const dbName = "Restaurant_Database";
    const request = indexedDB.open(dbName,2);
    request.onupgradeneeded = function(event) {
      var db = event.target.result;
      var objStore = db.createObjectStore("Restaurant_Reviews", { autoIncrement : true });
      reviewData.forEach(function(review) {
          objStore.add(review);
      });
    };
  }
createReviewsIDB();

/*
function updateReviews(){
  var request = indexedDB.open("Restaurant_Database");
  request.onsuccess = function(){
    var db = request.result;
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
}*/
