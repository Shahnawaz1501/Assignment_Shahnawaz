import React, { useEffect, useRef } from "react";
import { Rect, Transformer } from "react-konva";

const Shape = ({ shapeProps, isSelected, onSelect, onChange }) => {
  // Refs to hold references to the shape and transformer components
  const shapeRef = useRef();
  const transformerRef = useRef();

  useEffect(() => {
    // Update the transformer's target node when selection state changes
    if (isSelected) {
      transformerRef.current.setNode(shapeRef.current); // Set shapeRef as the target for the transformer
      transformerRef.current.getLayer().batchDraw(); // Batch draw to refresh the canvas
    }
  }, [isSelected]);

  const onMouseEnter = (event) => {
    // Change cursor to "move" when hovering over the shape
    event.target.getStage().container().style.cursor = "move";
  };

  const onMouseLeave = (event) => {
    // Change cursor back to "crosshair" when leaving the shape
    event.target.getStage().container().style.cursor = "crosshair";
  };

  return (
    <>
      <Rect
        ref={shapeRef}
        fill="transparent"
        stroke="black"
        onMouseDown={onSelect}
        {...shapeProps}
        draggable
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onDragEnd={(event) => {
          // Update shapeProps after dragging
          onChange({
            ...shapeProps,
          });
        }}
        onTransformEnd={() => {
          // Reset scaling after transforming
          const node = shapeRef.current;
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
          });
        }}
      />
      {isSelected && <Transformer ref={transformerRef} />}
    </>
  );
};

export default Shape;