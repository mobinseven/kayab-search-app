angular.module('Kayab')
  .controller('SignupCtrl', function($scope,$window, $auth,$rootScope) {

    $scope.signup = function() {
      var user = {
        email: $scope.email,
        password: $scope.password
      };

      $auth.signup(user)
        .catch(function(response) {
          console.log(response.data);
        })
      .then(function(data){
        $window.localStorage.currentUser = JSON.stringify(data.data.user);
        $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
        console.log($rootScope.currentUser);
      })
      ;
    };
  });
