// must include jquery and imgareaselect

// to access image in the FormData, use key 'img'
(function($) {

    $.fn.jfcrop = function( options) {

        // default settings, can be changed by passing in options
        """
        canvasid is the id of the canvas element on page. will be where image preview is shown
        aspectRatio, handles are a part of imageAreaSelect parameters 
        onlyenc_URL: if set true handler will be executed on a FormData object, if false handler will be executed on the dataURL converted from canvas
        cropquality: value from 0 to 1 with 1 being best quality and slowest conversion from canvas to dataURL
        buttonid: id of button that triggers posting of final cropped image
        handler: function that is executed on cropped file or dataURL
        imgName: if sending post request, will save file under this name
        """
        var settings = $.extend({
            canvasid: 'myCanvas',
            aspectRatio: '1:1',
            handles:true,
            cropwidth:100,
            cropheight:100,
            onlyenc_URL: true,
            cropquality: 0.5,
            cropformat:'jpeg',
            buttonid: "submitbtn",
            posturl:'/',
            handler: 'post',
            imgName: 'imgname',
        }, options);


        // call to imgAreaSelect to show cropping tool
        this.imgAreaSelect({  
          aspectRatio: settings.aspectRatio, 
          handles: settings.handles,
          onSelectChange: preview 
        }); 


      var sendURL, dataURL, canvas, context, tosubmit;
      var origimage = this;
     
      $('#' + settings.buttonid).unbind('click').click(submittodo);

        // creates preview of the cropped image using HTML5 canvas
        function preview(img, selection) { 
          var scaleX = settings.cropwidth / (selection.width || 1); 
          var scaleY = settings.cropheight / (selection.height || 1);

          canvas = document.getElementById(settings.canvasid);
          canvas.width = settings.cropwidth;
          canvas.height = settings.cropheight;
          context = canvas.getContext('2d');
         
          var imageObj = new Image();

          imageObj.onload = function() { 
            // draw cropped image
            var sourceX = selection.x1;
            var sourceY = selection.y1;
            var sourceWidth = selection.width || 1;
            var sourceHeight = selection.height || 1;
            var destWidth = settings.cropwidth; 
            var destHeight = settings.cropheight;
            var destX = 0;
            var destY = 0;

            context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight); 
          };
          
            imageObj.src = img.src;

        };

        // Convert dataURL to Blob object
        function dataURLtoBlob(dataURL) {
          // Decode the dataURL    
          var binary = atob(dataURL.split(',')[1]);
          // Create 8-bit unsigned array
          var array = [];
          for(var i = 0; i < binary.length; i++) {
              array.push(binary.charCodeAt(i));
          }
          // Return our Blob object
          return new Blob([new Uint8Array(array)], {type: 'image/'+settings.cropformat});
        };

          function submittodo (e) {
          
            e.stopPropagation(); 

            // this can be directly set as source of image on page
            dataURL = canvas.toDataURL('image/' + settings.cropformat, settings.cropquality);
            tosubmit = JSON.stringify(dataURL);

            // prepare to send file
            var fl = dataURLtoBlob(dataURL);
            var fd = new FormData();
            // adds file to fd with the key 'img'
            fd.append('img', fl, settings.imgName+ "."+settings.cropformat);

              // if set in options, removes header of the dataURL and can be directly decoded and saved to server
              if(settings.onlyenc_URL)
              {
                  if(settings.handler == 'post')
                  {
                    $.ajax({
                      url: settings.posturl,
                      type:'POST',
                      processData:false,
                      contentType: false,
                      data: fd,
                      success: alert("Successful upload!"),
                    });
                 }
                 else
                 {
                  settings.handler(fd)
                 }
                 
              }
              else
              {
                settings.handler(tosubmit) 
              }

          };
          

        }


}(jQuery));