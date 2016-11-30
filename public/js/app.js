(function(){
  angular.module('tour', [])
  .controller('mainController', mainController);

  mainController.$inject = ['$scope', '$http', '$state', 'NgMap'];

  function mainController($scope, $http, $state, NgMap) {
    var self = this;
    var rootUrl = "http://localhost:3000"
    self.currentUser = JSON.parse(localStorage.getItem('user'));
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
        $state.go('login', {url: '/login'});
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
        self.currentUser = res.data.user
        self.id = res.data.user.id
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
      $state.go('login', {url: '/login'})
    } // end this.logout

    // This method will hit the rails API
    // for the add marker route and add
    // a marker to the currrent user
    this.createMarker = function(marker, user_id){
      var marker = {
        title: marker.title,
        description: marker.description,
        audio: marker.audio,
        category: marker.category
      }
      return $http({
        url: `${rootUrl}/users/:id/add_marker`,
        method: 'POST',
        data: {marker: marker}
      })
      .then(function(res){
        self.currentUser = JSON.parse(localStorage.getItem('user'));
        self.newMarker = res.config.data.marker;
        var markers = self.currentUser.markers;
        var newMarker = res.config.data.marker;
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
