var rootUrl = "http://localhost:3000";
var map;
(function(){
  angular.module('tour')
    // .controller('mapController', function() {
    .controller('mapController', mapController);
    mapController.$inject = ['$http', '$scope', 'CreateMarker', 'ShowUserMarkers'];
    // .controller('mapController', ['$http', '$scope', 'CreateMarker'])
      function mapController($http, $scope, CreateMarker, ShowUserMarkers) {
        let self = this,
        marker,
        infowindow;
        function initialize() {
          var latlng = new google.maps.LatLng(37.0902, -95.7129);
          var options = {
            zoom: 4,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          }
          map = new google.maps.Map(document.getElementById("map"), options);
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
          // ShowUserMarkers.showUserMarkers(JSON.parse(localStorage.getItem('user')))
          showAllMarkers();
        } // end initialize function

        window.showAllMarkers = function() {
          return $http({
            url: `${rootUrl}/markers`,
            method: 'GET',
            // data: {markers: markers}
          })
          .then(function(res) {
            for (var i = 0; i < res.data.length; i++) {
              let lat = res.data[i].latitude;
              let lng = res.data[i].longitude;
              let latLng = new google.maps.LatLng(lat, lng);
              let marker = new google.maps.Marker({
                position: latLng,
                map: map
              }) // end marker object
            } // end for loop
          }) // end .then
          .catch(function(err) {
            console.log(err);
          })
        } // end showAllMarkers function

      window.saveData = function() {
        debugger;
        var location = {
          title: escape(document.getElementById("title").value),
          description: escape(document.getElementById("description").value),
          audio: document.getElementById("audio").value,
          category: document.getElementById("category").value,
          longitude: marker.position.lng(),
          latitude: marker.position.lat()
        }
        CreateMarker.createMarker(location);
        // infowindow.close();
      }
      // load the map
      initialize();

  }
})();
