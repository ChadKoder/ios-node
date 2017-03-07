PhotoDash.angular.factory('selectionService',['$q', function ($q) {
       var selectedPhotos = [];
       var service = this;
       var photoBlobs = [];
       service.files = [];
       
       service.showPreloader = function(msg){
           PhotoDash.fw7.app.showPreloader(msg);
       };
       
       service.hidePreloader = function(){
           PhotoDash.fw7.app.hidePreloader();
       };
              
        var getSelectedItemIndex = function(id){
            for (var i = 0; i < selectedPhotos.length; i++){
                if (selectedPhotos[i] == id){
                    return i;
                }
            }

            return null;
        };
        
          var dataURItoBlob = function(dataURI) {
          // convert base64/URLEncoded data component to raw binary data held in a string
          var byteString;
          if (dataURI.split(',')[0].indexOf('base64') >= 0)
          byteString = atob(dataURI.split(',')[1]);
          else
          byteString = unescape(dataURI.split(',')[1]);
          
          // separate out the mime component
          var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
          
          // write the bytes of the string to a typed array
          var ia = new Uint8Array(byteString.length);
          for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
          }
          
          return new Blob([ia], {type:mimeString});
          };
          
            var createFile = function(libraryItem) {
              var deferred = $q.defer();
              
             // if (vm.selectedPhotos.length > 0){
              // vm.showPreloader('Creating album...');
              var canvas = document.createElement('canvas');
              var ctx = canvas.getContext('2d');
              // console.log('processing photo #' + i);
              // console.log('photoURL: ' + vm.selectedPhotos[i].photoURL);
              // console.log('photo.width: ' + vm.selectedPhotos[i].width);
              canvas.width = libraryItem.width;
              canvas.height = libraryItem.height;
              var img = new Image();
              
              img.onload = function(){
              ctx.drawImage(img, 0, 0);
              var dataURL = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
              var blob = dataURItoBlob(dataURL);
              
              deferred.resolve({
                               'index': i,
                               'blobObj': blob
                               });
              /*testPhotos.push(blob);
               
               if (testPhotos.length === vm.selectedPhotos.length){
               vm.hidePreloader();
               
               }*/
              
              
              };
              
              img.src = libraryItem.photoURL;
              return deferred.promise;
             // }
              
                          
                };
        
        var createBlobAndAdd = function(libraryItem){
          createFile(libraryItem).then(function(result){
              photoBlobs.push(result.blobObj);
              console.log('seectionSERVICE --- ADDED BLOB!!!');
          }, function(err){
              console.log('selService.ERRRORRR---');
          });
       };
       
       
       var add = function(libraryItem){
           selectedPhotos.push(libraryItem);
           
           //setTimeout(createBlobAndAdd(libraryItem), 700);
          // fileService.add(libraryItem);
         /*   cordova.plugins.photoLibrary.getPhoto(libraryItem, function(photo){
                        service.files.push(photo);
                        
                        console.log('added sendable photo....');
                        
                        // if (photos.length === service.selectedPhotos.length){
                        //resolve(photos);
                        //  }
                        
                        
                        }, function (err){
                        console.log('error pushing file...');
                        //service.hidePreloader();
                        //reject('error retrieving photo sync...');
                        });*/
       };
       
       var remove = function(id){
       
           var index = getSelectedItemIndex(id);
           
           if (index !== null){
               if (selectedPhotos.length === 1){
                   selectedPhotos = [];
                   return;
               } else {
                   selectedPhotos.splice(index, 1);
                   return;
               }
           }
       };
       
       var clear = function(){
	   console.log('SELECTION SERVICE -- Clearing SELECTED PHOTOS....');
           selectedPhotos = [];
       };
       
       var get = function(){
	   console.log('SELECTION SERVICRE -- GETTING SELECTED PHOTOTS TOTAL: ' + selectedPhotos.length);
           return selectedPhotos;
       };
       
       var getFiles = function(){
           return service.files;
       };
           
      return {
           add: add,
           remove: remove,
           clear: clear,
           get: get,
           getFiles: getFiles
        }

 }]);
