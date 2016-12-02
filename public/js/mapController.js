angular.module('tour')
  // .controller('mapController', function() {
  .controller('mapController', mapController);
  mapController.$inject = ['$http', '$scope'];
    function mapController($http, $scope) {
    let self = this,
    marker,
    infowindow;
    function initialize() {
      debugger;
      var latlng = new google.maps.LatLng(37.0902, -95.7129);
      var options = {
        zoom: 4,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      var map = new google.maps.Map(document.getElementById("map"), options);
      var html = "<table>" +
                 "<tr><td>Title:</td> <td><input type='text' id='title'/> </td> </tr>" +
                 "<tr><td>Description:</td> <td><input type='text' id='description'/></td> </tr>" +
                 "<tr><td>Audio URL:</td> <td><input type='url' id='audio'/></td> </tr>" +
                 "<tr><td>Category:</td> <td><select id='category'>" +
                 "<option value='art' SELECTED>art</option>" +
                 "<option value='history'>history</option>" +
                 "<option value='literature'>literature</option>" +
                 "<option value='music'>music</option>" +
                 "</select> </td></tr>" +
                 "<tr><td></td><td><input type='button' value='Save & Close' onclick='saveData()'/></td></tr>";
      infowindow = new google.maps.InfoWindow({
        content: html
      });

      google.maps.event.addListener(map, "rightclick", function(event) {
        marker = new google.maps.Marker({
          position: event.latLng,
          map: map
        });
        google.maps.event.addListener(marker, "click", function() {
          infowindow.open(map, marker);
        }); // end addListener
      }); // end addListener
    } // end initialize function

    window.saveData = function() {
      var location = {
        title: escape(document.getElementById("title").value),
        description: escape(document.getElementById("description").value),
        audio: document.getElementById("audio").value,
        category: document.getElementById("category").value
        // longitude: marker.lng(),
        // latitude: marker.lat()
      }
      return $http({
        url: `localhost:4000/users/:id/add_marker`,
        // url: `${rootUrl}/users/${self.currentUser.id}/add_marker`,
        method: 'POST',
        data: {marker: location},
        headers: {
          'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
        }
      })
      .then(function(res){
        // self.currentUser = JSON.parse(localStorage.getItem('user'));
        let markers = self.currentUser.markers;
        let newMarker = res.config.data.marker;
        markers.unshift(newMarker); // adds to beginning of array
      })
      .catch(function(error){
        console.log('ERROR ~>', error);
      });
    }

    initialize();


    // the below code is from https://jsfiddle.net/8yL2vhoe/.
    // let locations = JSON.parse(localStorage.getItem('user')).markers;
    //
    // var geocoder;
    // var map;
    // var bounds = new google.maps.LatLngBounds();
    //
    // function initialize() {
    //   map = new google.maps.Map(
    //   document.getElementById("map_canvas"), {
    //     // center map on USA
    //     center: new google.maps.LatLng(37.0902, -95.7129),
    //     // center: self.place.geometry.location,
    //     zoom: 4,
    //     mapTypeId: google.maps.MapTypeId.ROADMAP
    //   });
    //   var infoWindow = new google.maps.InfoWindow({map_canvas: map_canvas});
    //   if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(function(position) {
    //       var pos = {
    //         lat: position.coords.latitude,
    //         lng: position.coords.longitude
    //       };
    //       infoWindow.setPosition(pos);
    //       infoWindow.setContent('Location FOund.');
    //       map.setCenter(pos);
    //       map.setZoom(9);
    //     }, function() {
    //       handleLocationError(true, infoWindow, map.getCenter());
    //     });
    //   } else {
    //     handleLocationError(false, infoWindow, map.getCenter());
    //   } // end if else
    //   function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    //     infoWindow.setPosition(pos);
    //     infoWindow.setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.' : 'Error: Your browser doesn\t support geolocation.');
    //   }
    //   geocoder = new google.maps.Geocoder();
    //   for (i = 0; i < locations.length; i++) {
    //       geocodeAddress(locations, i);
    //   } // end for
    // } // end initialize function
    //
    // google.maps.event.addDomListener(window, "load", initialize);
    //
    // function geocodeAddress(locations, i) {
    //   var title = locations[i][0];
    //   var address = locations[i][1];
    //   var url = locations[i][2];
    //   geocoder.geocode({
    //     'address': locations[i][1]
    //   },
    //
    //   function (results, status) {
    //     if (status == google.maps.GeocoderStatus.OK) {
    //       var marker = new google.maps.Marker({
    //         icon: url,
    //         map: map,
    //         position: results[0].geometry.location,
    //         title: title,
    //         animation: google.maps.Animation.DROP,
    //         address: address,
    //         url: url
    //       })
    //       infoWindow(marker, map, title, address, url);
    //       bounds.extend(marker.getPosition());
    //       map.fitBounds(bounds);
    //     } else {
    //       alert("geocode of " + address + " failed:" + status);
    //     }
    //   });
    // } // end anonymous function
    //
    // function infoWindow(marker, map, title, address, url) {
    //   google.maps.event.addListener(marker, 'click', function () {
    //
    //   // Reference to the DIV which receives the contents of the infowindow using jQuery
    //   var iwOuter = $('.gm-style-iw');
    //
    //   /* The DIV we want to change is above the .gm-style-iw DIV.
    //   * So, we use jQuery and create a iwBackground variable,
    //   * and took advantage of the existing reference to .gm-style-iw for the previous DIV with .prev().
    //   */
    //   var iwBackground = iwOuter.prev();
    //
    //   // Remove the background shadow DIV
    //   iwBackground.children(':nth-child(2)').css({'display' : 'none'});
    //
    //   // Remove the white background DIV
    //   iwBackground.children(':nth-child(4)').css({'display' : 'none'});
    //
    //   var html = '<div id="iw-container">' +
    //     '<div class="iw-title">Porcelain Factory of Vista Alegre</div>' +
    //     '<div class="iw-content">' +
    //       '<div class="iw-subTitle">History</div>' +
    //       '<img src="http://maps.marnoto.com/en/5wayscustomizeinfowindow/images/vistalegre.jpg" alt="Porcelain Factory of Vista Alegre" height="115" width="83">' +
    //       '<p>Founded in 1824, the Porcelain Factory of Vista Alegre was the first industrial unit dedicated to porcelain production in Portugal. For the foundation and success of this risky industrial development was crucial the spirit of persistence of its founder, José Ferreira Pinto Basto. Leading figure in Portuguese society of the nineteenth century farm owner, daring dealer, wisely incorporated the liberal ideas of the century, having become "the first example of free enterprise" in Portugal.</p>' +
    //       '<div class="iw-subTitle">Contacts</div>' +
    //       '<p>VISTA ALEGRE ATLANTIS, SA<br>3830-292 Ílhavo - Portugal<br>'+
    //       '<br>Phone. +351 234 320 600<br>e-mail: geral@vaa.pt<br>www: www.myvistaalegre.com</p>'+
    //     '</div>' +
    //     '<div class="iw-bottom-gradient"></div>' +
    //   '</div>';
    //   iw = new google.maps.InfoWindow({
    //     content: html,
    //     //maxWidth: 350
    //   });
    //   iw.open(map, marker);
    //   });
    // } // end infowindow function
    //
    // function createMarker(results) {
    //   var marker = new google.maps.Marker({
    //     icon: 'http://maps.google.com/mapfiles/ms/icons/blue.png',
    //     map: map,
    //     position: results[0].geometry.location,
    //     title: title,
    //     animation: google.maps.Animation.DROP,
    //     address: address,
    //     url: url
    //   })
    //   bounds.extend(marker.getPosition());
    //   map.fitBounds(bounds);
    //   infoWindow(marker, map, title, address, url);
    //   return marker;
    // } // end createMarker function
    //
    // initialize();

 };
