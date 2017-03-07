PhotoDash.angular.factory('initService', ['$q', function ($q) {
       
       var getPageTitle = function(pageName){
       console.log('getting page title...');
           if (pageName === 'index'){
               return 'Photo Dash1';
           }
       
       }
       
          return {
          getPageTitle: getPageTitle
                   }

 }]);
