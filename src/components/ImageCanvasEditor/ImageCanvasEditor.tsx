"use client";
import React, { useRef, useState } from "react";

export const ImageCanvasEditor = () => {
  const [image, setImage] = useState(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrawStart = (event) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
    canvas.isDrawing = true;
  };

  const handleDrawing = (event) => {
    if (!canvasRef.current.isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
    ctx.stroke();
  };

  const handleDrawEnd = () => {
    canvasRef.current.isDrawing = false;
  };

  const exportMaskedImage = () => {
    const canvas = canvasRef.current;
    // Here you would implement the logic to export the mask or process further as needed
    console.log(canvas.toDataURL());
  };

  return (
    <div>
      <input type="file" onChange={handleUpload} accept="image/*" />
      <div
        onMouseDown={handleDrawStart}
        onMouseMove={handleDrawing}
        onMouseUp={handleDrawEnd}
        onMouseLeave={handleDrawEnd}
      >
        {image && (
          <canvas
            ref={canvasRef}
            width={imageRef.current?.width}
            height={imageRef.current?.height}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          ></canvas>
        )}
      </div>
      <button onClick={exportMaskedImage}>Export Mask</button>
    </div>
  );
};
