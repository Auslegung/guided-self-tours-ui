var rootUrl = "https://evening-forest-95483.herokuapp.com/"
var app = angular.module('tour');
app.service('CreateMarker', ['$http', function($http) {
  this.createMarker = function(marker) {
    let self = this
    return $http({
      url: `${rootUrl}/users/:id/add_marker`,
      method: 'POST',
      data: {marker: marker},
      headers: {
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    })
    .then(function(res){
      self.currentUser = JSON.parse(localStorage.getItem('user'));
      let markers = self.currentUser.markers;
      let newMarker = res.config.data.marker;
      markers.unshift(newMarker); // adds to beginning of array
    })
    .catch(function(error){
      console.log('ERROR ~>', error);
    })
  } // end createMarker function
}]); // end CreateMarker service

app.service('ShowUserMarkers', ['$http', function($http) {
  this.showUserMarkers = function(user) {
    let self = this;
    // self.currentUser = JSON.parse(localStorage.getItem('user'));
    return $http({
      url: `${rootUrl}/users/:id`,
      method: 'GET',
      data: {markers: user.markers}
      // headers: {
      //   'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      // }
    })
    .then(function(user){
      let markers = user.markers;
    })
    .catch(function(err){
      console.log(err);
    })
  } // end this.showUserMarkers function
}]); // end ShowUserMarkers service

(function(){
  app.controller('mainController', mainController);

  mainController.$inject = ['$scope', '$http', '$state', 'NgMap', 'CreateMarker'];

  function mainController($scope, $http, $state, NgMap, createMarker) {
    var self = this;
    self.newPassword = {};

    // This method will hit the rails API
    // for the create route and make a
    // new user
   this.createUser = function(user) {
      return $http({
        url: `${rootUrl}/users`,
        method: 'POST',
        data: {user: user}
      })
      .then(function(res) {
        if (res.data.status === 200) {
          console.log('success');
          self.success = true;
        }
      })
      .then(function(res){
        $state.go('home', {url: '/'});
      })
      .catch(function(err) {
        console.log(err);
      })
    } // end this.createUser

    // This method will hit the rails API
    // for the login route and log in the
    // user with jwt
    this.login = function(user){
      return $http({
        url: `${rootUrl}/users/login`,
        method: 'POST',
        data: {user: user}
      })
      .then(function(res){
        debugger;
        self.currentUser = res.data.user
        localStorage.setItem('token', JSON.stringify(res.data.token))
        localStorage.setItem('user', JSON.stringify(res.data.user));
        $state.go('user', {url:'/user', user: res.data.user});
      })
      .catch(function(error){
        console.log('ERROR ~>', error);
      })
    } // end this.login

    // This method will hit the rails API
    // for the login route and log out the
    // user
    this.logout = function(user){
      localStorage.removeItem('user');
      localStorage.removeItem('token')
      $state.go('home', {url: '/home'})
    } // end this.logout

    // This method will hit the rails API
    // for the add marker route and add
    // a marker to the currrent user
    this.createMarker = function(marker){
      var marker = {
        title: marker.title,
        description: marker.description,
        audio: marker.audio,
        category: marker.category,
        longitude: marker.longitude,
        latitude: marker.latitude
      }
      return $http({
        url: `${rootUrl}/users/:id/add_marker`,
        // url: `${rootUrl}/users/${self.currentUser.id}/add_marker`,
        method: 'POST',
        data: {marker: marker},
        headers: {
          'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
        }
      })
      .then(function(res){
        self.currentUser = JSON.parse(localStorage.getItem('user'));
        let markers = self.currentUser.markers;
        let newMarker = res.config.data.marker;
        markers.unshift(newMarker); // adds to beginning of array
      })
      .catch(function(error){
        console.log('ERROR ~>', error);
      })
    } // end this.createMarker

    // This method will hit the rails API
    // for the delete user method and will
    // remove the user from the db
    this.deleteUser = function(user){
      return $http({
        url: `${rootUrl}/users/:id`,
        method: 'DELETE',
        data: {user: user}
      })
      .then(function(res){
        self.user = res.config.data.user;
      })
      .catch(function(error){
        console.log('ERROR ~>', error);
      })
    } // end this.deleteUser

    // This method will hit the rails API
    // for the update user method and will
    // update the user's info in the db
    this.update = function(user_id, newInfo){
      return $http({
        url: `${rootUrl}/users/:id`,
        method: 'PATCH',
        data: {user: newInfo}
      })
      .then(function(res){
        self.newPassword = {};
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        $state.go('home', {url: '/'})
      })
      .catch(function(error){
        console.log(error);
      })
    } // end this.update

    $http.get(`${rootUrl}/markers`)
      .then(function(res){
        self.markers = res.data;
      })
  } // end mainController
})();
