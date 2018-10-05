class Favorite {

  static selectFavorite(restaurant){
    if(!restaurant.is_favorite || restaurant.is_favorite == "false"){
      var init = {method: 'PUT'};
      fetch(`http://localhost:1337/restaurants/${restaurant.id}/?is_favorite=true`,init)
      .then(function(){
        restaurant.is_favorite = true;
        var favorite = document.getElementById("restaurant-favorite");
        favorite.src = DBHelper.getFavorite(restaurant.is_favorite);
      })
      .then(function(){
        DBHelper.updateOfflineFavorites(restaurant.is_favorite, restaurant.id);
      })
      .catch(function(restaurant){
        restaurant.is_favorite = false;
        var favorite = document.getElementById("restaurant-favorite");
        favorite.src = DBHelper.getFavorite(restaurant.is_favorite);
        DBHelper.updateOfflineFavorites(restaurant.is_favorite, restaurant.id);
      });
    }else{
      var init = {method: 'PUT'};
      fetch(`http://localhost:1337/restaurants/${restaurant.id}/?is_favorite=false`,init)
      .then(function(){
        restaurant.is_favorite = false;
        var favorite = document.getElementById("restaurant-favorite");
        favorite.src = DBHelper.getFavorite(restaurant.is_favorite);
      })
      .then(function(){
        DBHelper.updateOfflineFavorites(restaurant.is_favorite, restaurant.id);
      })
      .catch(function(restaurant){
        restaurant.is_favorite = false;
        var favorite = document.getElementById("restaurant-favorite");
        favorite.src = DBHelper.getFavorite(restaurant.is_favorite);
        DBHelper.updateOfflineFavorites(restaurant.is_favorite, restaurant.id);
      });
    }
  }
}
