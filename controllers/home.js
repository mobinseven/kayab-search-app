function loadDb()
{
  var lib = new localStorageDB("library", localStorage);
  if( lib.isNew() ) {
    lib.createTable("items", ["code", "date"]);
  }
  try{return lib.query("items", null);}
  catch(e){console.error(e)}
}
angular.module('Kayab')
  .controller('HomeCtrl', function($scope, $window, $rootScope, $auth, API) {
  ///////////////////////////////////
  $scope.itemdb = loadDb();
  console.log($scope.itemdb);
  $scope.loadData = function(item){
    console.log(data[item.code].label);
    item.code=data[item.code].label;
  }
  ///////////////////////////////////
    if ($auth.isAuthenticated() && ($rootScope.currentUser && $rootScope.currentUser.username)) {
      API.getFeed().success(function(data) {
        $scope.photos = data;
      });
    }

    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };
  });
