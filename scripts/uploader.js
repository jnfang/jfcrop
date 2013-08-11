$(document).ready(function () { 

    $('#imgpath').change(function(){

        function readURL(input){
          if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e){
              $('#sample').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
          };
        };

        readURL(this);

        return false;

        
    });

    $('img#sample').jfcrop();

});
