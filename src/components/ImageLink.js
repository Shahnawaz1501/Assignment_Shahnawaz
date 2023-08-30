import React, { useState, useEffect } from "react";
import { Image } from "react-konva";

const ImageLink = ({
  imageUrl,
  setCanvasMeasures,
  onMouseDown,
  canvasMeasures,
  onMouseUp,
  onMouseMove,
  zoomLevel,
}) => {
  // State to hold the loaded image
  const [img, setImg] = useState(null);

  useEffect(() => {
    // Create a new image object
    const imgDisplay = new window.Image();
    // Set the source URL for the image
    imgDisplay.src = imageUrl;

    // Function to handle image loading
    const handleImageLoad = () => {
      // Calculate the aspect ratio of the image
      const aspectRatio = imgDisplay.width / imgDisplay.height;
      // Define maximum dimensions for the canvas
      const maxWidth = 900;
      const maxHeight = 550;

      let newWidth = imgDisplay.width;
      let newHeight = imgDisplay.height;

      // Adjust dimensions if image is larger than canvas
      if (newWidth > maxWidth) {
        newWidth = maxWidth;
        newHeight = newWidth / aspectRatio;
      }

      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = newHeight * aspectRatio;
      }

      // Update the canvas dimensions using the provided callback function
      setCanvasMeasures({
        width: newWidth,
        height: newHeight,
      });

      // Set the loaded image in the state
      setImg(imgDisplay);
    };

    // Listen for the "load" event of the image
    imgDisplay.addEventListener("load", handleImageLoad);

    // Clean up by removing the event listener when the component unmounts
    return () => {
      imgDisplay.removeEventListener("load", handleImageLoad);
    };
  }, [imageUrl, setCanvasMeasures]);

  // If the image is not loaded yet, return null
  if (!img) {
    return null;
  }

  const scale = zoomLevel;

  // Render the loaded image using the Image component from react-konva
  return (
    <Image
      image={img}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      width={canvasMeasures.width * scale}
      height={canvasMeasures.height * scale}
      scaleX={scale}
      scaleY={scale}
    />
  );
};

export default ImageLink;