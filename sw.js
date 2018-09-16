self.addEventListener('install', function(e) {
   caches.open('offline').then(function(cache) {
     return cache.addAll([
       '/',
       '/index.html',
       '/restaurant.html',
       '/js/dbhelper.js',
       '/js/main.js',
       '/js/restaurant_info.js',
       '/js/idb-data.js',
       '/img/1.jpg',
       '/img/2.jpg',
       '/img/3.jpg',
       '/img/4.jpg',
       '/img/5.jpg',
       '/img/6.jpg',
       '/img/7.jpg',
       '/img/8.jpg',
       '/img/9.jpg',
       '/img/10.jpg',
       '/css/responsive.css',
       '/css/restaurant.css',
       '/css/styles.css',
       '/manifest.json',
     ]);
   })
});


self.addEventListener('fetch', function(event) {
  console.log(event.request.url);

  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response){
        return response || fetch(event.request);
      }

      var fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(
          function(response) {
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            var responseToCache = response.clone();

            caches.open('offline')
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});
