function imageHandlerConnection() {
  console.log("Image Handler reports for duty!");
};

function handleImage(imageId) {
  let originalImage = document.getElementById(`${imageId}`);
  let outputImage = document.getElementById("resized-img");

  resizeImage(imageId)

  //display image for testing:
  outputImage.src = originalImage.src
};

//resize the image and draw it to the canvas
function resizeImage(imageId) {
    //create an image object from the path
    const originalImage = new Image();
    originalImage.crossOrigin = "anonymous";
    originalImage.src = document.getElementById(`${imageId}`).src;

    //get a reference to the canvas
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    //wait for the image to load
    originalImage.addEventListener('load', function() {

        //get the original image size and aspect ratio
        const originalWidth = originalImage.naturalWidth;
        const originalHeight = originalImage.naturalHeight;
        const aspectRatio = originalWidth/originalHeight;

        let newWidth = 200;
        let newHeight = newWidth/aspectRatio;
        canvas.width = 200;
        canvas.height = 200;

        //set the canvas size
        canvas.width = 200;
        canvas.height = 200;

        //render the image
        ctx.drawImage(originalImage, 0, 0, newWidth, newHeight);
        const base64 = canvas.toDataURL("image/jpeg").split(';base64,')[1];
        console.log(base64)
    });
}
