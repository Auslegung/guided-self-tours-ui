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
        newMarker,
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
          infowindow = new google.maps.InfoWindow;
          //
          google.maps.event.addListener(map, "rightclick", function(event) {
            newMarker = new google.maps.Marker({
              position: event.latLng,
              map: map
            });
            let infowindow = new google.maps.InfoWindow({
              content: html
            });
            google.maps.event.addListener(newMarker, "click", function() {
              infowindow.open(map, this); // using `this` instead of `newMarker` opens the correct infowindow onclick
            }); // end addListener
            infowindow.open(map, newMarker);
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
              let markerInfo = res.data[i];
              // add markers to the map corresponding to their lat and lng
              let marker = new google.maps.Marker({
                position: {lat: markerInfo.latitude, lng: markerInfo.longitude},
                map: map,
                animation: google.maps.Animation.DROP
              }); // end marker object
              // create content for infowindow
              let deleteAndUpdateButtons = '<button class="infowindow-content-bottom-button" type="submit" ng-click="main.deleteMarker(this.marker)">' + // this OR self?
                                              'DELETE' +
                                            '</button>' + // end delete button
                                            '<button class="infowindow-content-bottom-button" type="submit" ng-click="main.updateMarker(this.marker)">' + // MIGHT NEED TO PASS SOMETHING BESIDES this.marker
                                              'UPDATE' +
                                            '</button>'; // end update button
              // if the user_id === currentUser.id, add deleteAndUpdateButtons.  Also, make markers green or something.
              let content = '<div class="infowindow-content-wrapper">' +
                              '<div class="infowindow-content-header">' +
                                '<div class="infowindow-content-header-title">' +
                                  '<p>' + markerInfo.title + '</p>' +
                                '</div>' + // end header-title
                                '<div class="infowindow-content-header-username">' +
                                  '<p>' + markerInfo.username + '</p>' +
                                '</div>' + // end header-username
                                '<div class="infowindow-content-description">' +
                                  '<p>' + markerInfo.description + '</p>' +
                                '</div>' + // end description
                                '<div class="infowindow-content-bottom-wrapper">' +
                                  // '<audio controls>' +
                                  //   '<source src="markerInfo.audio" type="audio/ogg">' +
                                  // '</audio>' +
                                  deleteAndUpdateButtons +
                                '</div>' + // end bottom-wrapper
                              '</div>' + // end header
                            '</div>'; + // end content-wrapper
              // attach infowindow to each marker containing its info
              google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                  infowindow.setContent(content);
                  infowindow.open(map, marker);
                }
              })(marker, i)); // end addListener
            } // end for loop
          }) // end .then
          .catch(function(err) {
            console.log(err);
          })
        } // end showAllMarkers function

      window.saveData = function() {
        var location = {
          title: escape(document.getElementById("title").value),
          description: escape(document.getElementById("description").value),
          audio: document.getElementById("audio").value,
          category: document.getElementById("category").value,
          longitude: newMarker.position.lng(),
          latitude: newMarker.position.lat()
        }
        CreateMarker.createMarker(location);
        // Change infowindow content of newly created marker
      } // end saveData function

      // load the map
      initialize();

  }
})();
