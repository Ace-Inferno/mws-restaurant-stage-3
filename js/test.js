/*var reviews = [];
var resReviews = reviewData;

console.log(reviewData);

for(i=0;i<resReviews.length;i++){
  if(restaurantInfo.id == resReviews[i].restaurant_id){
    reviews.push(resReviews[i]);
  }
}

if (!reviews) {
  const noReviews = document.createElement('p');
  noReviews.innerHTML = 'No reviews yet!';
  container.appendChild(noReviews);
  return;
}
const ul = document.getElementById('reviews-list');
reviews.forEach(review => {
  ul.appendChild(createReviewHTML(review));
});
container.appendChild(ul);*/


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
