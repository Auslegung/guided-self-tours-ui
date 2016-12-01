angular.module('tour')
  .controller('mapController', function(NgMap) {
    var vm = this;
    vm.types = "['establishment']";
    vm.placeChanged = function() {
      vm.place = this.getPlace();
      console.log('location', vm.place.geometry.location);
      vm.map.setCenter(vm.place.geometry.location);
    }
    NgMap.getMap().then(function(map) {
      vm.map = map;
    });
 });
