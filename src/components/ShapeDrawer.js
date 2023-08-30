import React, { useState, useCallback, useEffect, useMemo } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { BsBoundingBoxCircles } from "react-icons/bs";
import { TfiZoomIn, TfiZoomOut } from "react-icons/tfi";
import { BiReset } from "react-icons/bi";
import { Stage, Layer } from "react-konva";
import { v1 } from "uuid";
import ImageLink from "./ImageLink";
import Shape from "./Shape";
import { toast } from "react-toastify";
import "../css/shapedrawer.css";

const ShapeDrawer = () => {
  // State variables for managing annotations and annotation mode
  const [annotations, setAnnotations] = useState([]);
  const [isAnnotationMode, setIsAnnotationMode] = useState(false);
  const [isAnnotationsSaved, setIsAnnotationsSaved] = useState(false);
  const [annotationsToDraw, setAnnotationsToDraw] = useState([]);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [updatedAnnotation, setUpdatedAnnotation] = useState([]);
  const [selectedId, selectAnnotation] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Array of image URLs
  const images = useMemo(
    () => [
      "/images/Image 1.jpg",
      "images/Image 2.jpg",
      "images/Image 3.webp",
      "images/Image 4.jpg",
      "/images/Image 5.jpg",
    ],
    []
  );

  // Update annotations to draw when annotations or newAnnotation change
  useEffect(() => {
    const updatedAnnotationsToDraw = [...annotations, ...updatedAnnotation];
    setAnnotationsToDraw(updatedAnnotationsToDraw);
  }, [annotations, updatedAnnotation]);

  // Handle going to the previous image
  const previousImageHandler = () => {
    if (currentImageIdx > 0) {
      setCurrentImageIdx(currentImageIdx - 1);
      resetHandler();
    }
  };

  // Handle going to the next image
  const nextImageHandler = () => {
    if (currentImageIdx < images.length - 1) {
      setCurrentImageIdx(currentImageIdx + 1);
      resetHandler();
    }
  };

  // Toggle annotation mode between enable and disable
  const annotationHandler = () => {
    setIsAnnotationMode((prevMode) => !prevMode);
  };

  // Handle zoom in and zoom out
  const zoomInHandler = () => {
    setZoomLevel((prevZoom) => prevZoom * 1.2);
  };

  const zoomOutHandler = () => {
    setZoomLevel((prevZoom) => Math.max(prevZoom / 1.1, 0.75));
  };

  // Handle resetting annotations and related states
  const resetHandler = () => {
    setAnnotations([]);
    selectAnnotation(null);
    setUpdatedAnnotation([]);
    setIsAnnotationsSaved(false);
    setZoomLevel(1);
    setIsAnnotationMode(false);
  };

  const [canvasMeasures, setCanvasMeasures] = useState({
    width: 800, // Set canvas width
    height: 400, // Set canvas height
  });

  // Handle mouse down event for creating a new annotation
  const mouseDownHandler = (event) => {
    if (
      isAnnotationMode &&
      selectedId === null &&
      updatedAnnotation.length === 0
    ) {
      const { x, y } = event.target.getStage().getPointerPosition();
      const id = v1();
      setUpdatedAnnotation([{ x, y, width: 0, height: 0, id }]);
    }
  };

  // Handle mouse move event for resizing the new annotation
  const mouseMoveHandler = (event) => {
    if (selectedId === null && updatedAnnotation.length === 1) {
      const sx = updatedAnnotation[0].x;
      const sy = updatedAnnotation[0].y;
      const { x, y } = event.target.getStage().getPointerPosition();
      const id = v1();
      setUpdatedAnnotation([
        {
          x: sx,
          y: sy,
          width: x - sx,
          height: y - sy,
          id,
        },
      ]);
    }
  };

  // Handle mouse up event for finalizing the new annotation
  const mouseUpHandler = () => {
    if (selectedId === null && updatedAnnotation.length === 1) {
      const newAnnotationData = updatedAnnotation[0];
      if (
        newAnnotationData.x !== newAnnotationData.x + newAnnotationData.width ||
        newAnnotationData.y !== newAnnotationData.y + newAnnotationData.height
      ) {
        annotations.push(...updatedAnnotation);
        setAnnotations(annotations);
      }
      setUpdatedAnnotation([]);
    }
  };

  // Handle mouse enter event for changing cursor
  const mouseEnterHandler = (event) => {
    event.target.getStage().container().style.cursor = "crosshair";
  };

  // Function to generate annotation JSON data
  const generateAnnotationsJSON = useCallback(() => {
    const annotationsJSON = {};
    const currentImage = images[currentImageIdx];
    annotationsJSON[currentImage] = annotations.map((annotation) => ({
      x1: annotation.x,
      y1: annotation.y,
      x2: annotation.x + annotation.width,
      y2: annotation.y + annotation.height,
    }));
    return JSON.stringify(annotationsJSON);
  }, [annotations, currentImageIdx, images]);

  // Handle saving annotation data
  const saveHandler = () => {
    const annotationsString = generateAnnotationsJSON();
    console.log(annotationsString); // Display the JSON string
    setIsAnnotationsSaved(true);
    toast.success("Saved Successfully!");
  };

  // Handle downloading annotation data
  const downloadAnnotationHandler = () => {
    if (isAnnotationsSaved) {
      if (annotations.length > 0) {
        const annotationsString = generateAnnotationsJSON();
        const blob = new Blob([annotationsString], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "annotations.json";
        a.click();

        URL.revokeObjectURL(url);
        setIsAnnotationsSaved(false);
        toast.success("Annotations downloaded successfully!");
      } else {
        toast.warning("Nothing to Submit");
      }
    } else {
      toast.error("Please Save First!");
    }
  };

  return (
    <div>
      {/* Icon container */}
      <div className="icon-container">
        {/* Left icons */}
        <div className="left-icons">
          <BsArrowLeft
            size={25}
            className="icon-style"
            onClick={previousImageHandler}
            title="Previous"
          />
        </div>
        {/* Center icons */}
        <div className="center-icons">
          {/* Conditional rendering for selection icon */}
          {isAnnotationMode ? (
            <BsBoundingBoxCircles
              size={23}
              className="selection-icon"
              title="Selection"
              onClick={annotationHandler}
            />
          ) : (
            <BsBoundingBoxCircles
              size={23}
              className="icon-style"
              title="Selection"
              onClick={annotationHandler}
            />
          )}
          {/* Zoom in icon */}
          <TfiZoomIn
            size={25}
            className="icon-style"
            title="Zoom in"
            onClick={zoomInHandler}
          />
          {/* Zoom out icon */}
          <TfiZoomOut
            size={25}
            className="icon-style"
            title="Zoom out"
            onClick={zoomOutHandler}
          />
          {/* Reset icon */}
          <BiReset
            size={25}
            className="icon-style"
            title="Reset"
            onClick={resetHandler}
          />
        </div>
        {/* Right icons */}
        <div className="right-icons">
          <BsArrowRight
            size={25}
            className="icon-style"
            onClick={nextImageHandler}
            title="Next"
          />
        </div>
      </div>

      {/* Canvas container */}
      <div className="canvas-container">
        <Stage
          width={canvasMeasures.width}
          height={canvasMeasures.height}
          onMouseEnter={mouseEnterHandler}
          onMouseDown={mouseDownHandler}
          onMouseMove={mouseMoveHandler}
          onMouseUp={mouseUpHandler}
        >
          <Layer>
            {/* Display the image */}
            <ImageLink
              setCanvasMeasures={setCanvasMeasures}
              canvasMeasures={canvasMeasures}
              imageUrl={images[currentImageIdx]}
              onMouseDown={() => {
                selectAnnotation(null);
              }}
              zoomLevel={zoomLevel}
            />
            {/* Display annotations */}
            {annotationsToDraw.map((annotation, i) => {
              return (
                <Shape
                  key={i}
                  shapeProps={annotation}
                  isSelected={annotation.id === selectedId}
                  onSelect={() => {
                    selectAnnotation(annotation.id);
                  }}
                  onChange={(newAttrs) => {
                    const rects = annotations.slice();
                    rects[i] = newAttrs;
                    setAnnotations(rects);
                  }}
                />
              );
            })}
          </Layer>
        </Stage>
      </div>
      {/* Button container */}
      <div className="button-container">
        {/* Save button */}
        <button className="save-button" onClick={saveHandler}>
          Save
        </button>
        {/* Submit button */}
        <button className="submit-button" onClick={downloadAnnotationHandler}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default ShapeDrawer;
