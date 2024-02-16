"use client";
import React, { useMemo, useRef, useState } from "react";
import { LazyBrush } from "lazy-brush";

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

  const lazy = useMemo(() => {
    return new LazyBrush({
      radius: 30,
      enabled: true,
      initialPoint: { x: 0, y: 0 },
    });
  }, []);

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

  const handle_pointer_move = (x, y) => {
    lazy.update({ x: x, y: y });
    const is_disabled = !lazy.isEnabled();
    if ((is_pressing && !is_drawing) || (is_disabled && is_pressing)) {
      is_drawing = true;
      points.push(lazy.brush.toObject());
    }
    if (is_drawing) {
      points.push(lazy.brush.toObject());
      draw_points({
        points: points,
        brush_color,
        brush_radius,
        mask: mode === "mask",
      });
    }
    mouse_has_moved = true;
  };

  const draw_points = ({ points, brush_color, brush_radius, mask }) => {
    if (!points || points.length < 2) return;
    const target_ctx = mask ? ctx.mask : ctx.temp;
    target_ctx.lineJoin = "round";
    target_ctx.lineCap = "round";

    target_ctx.strokeStyle = brush_color;
    target_ctx.lineWidth = brush_radius;
    let p1 = points[0];
    let p2 = points[1];
    target_ctx.moveTo(p2.x, p2.y);
    target_ctx.beginPath();
    for (let i = 1, len = points.length; i < len; i++) {
      const midPoint = mid_point(p1, p2);
      target_ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
      p1 = points[i];
      p2 = points[i + 1];
    }

    target_ctx.lineTo(p1.x, p1.y);
    target_ctx.stroke();
  };

  const get_pointer_pos = (e) => {
    const rect = canvas.interface.getBoundingClientRect();

    let clientX = e.clientX;
    let clientY = e.clientY;
    if (e.changedTouches && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    }

    return {
      x: ((clientX - rect.left) / rect.width) * width,
      y: ((clientY - rect.top) / rect.height) * height,
    };
  };

  const draw_lines = ({ lines }) => {
    lines.forEach((line) => {
      const { points: _points, brush_color, brush_radius } = line;
      draw_points({
        points: _points,
        brush_color,
        brush_radius,
        mask: mode === "mask",
      });
    });

    saveLine({ brush_color, brush_radius });
    if (mode === "mask") {
      save_mask_line();
    }
  };

  const save_mask_line = () => {
    if (points.length < 1) return;
    points.length = 0;

    trigger_on_change();
  };

  const saveLine = () => {
    if (points.length < 1) return;

    lines.push({
      points: points.slice(),
      brush_color: brush_color,
      brush_radius,
    });

    if (mode !== "mask") {
      points.length = 0;
    }

    ctx.drawing.drawImage(canvas.temp, 0, 0, width, height);

    trigger_on_change();
  };

  const trigger_on_change = () => {
    console.log(canvas.toDataURL());
  };

  export function clear() {
    lines = [];
    clear_canvas();
    line_count = 0;

    return true;
  }

  function clear_canvas() {
    values_changed = true;
    ctx.temp.clearRect(0, 0, width, height);

    ctx.temp.fillStyle = mode === "mask" ? "transparent" : "#FFFFFF";
    ctx.temp.fillRect(0, 0, width, height);

    if (mode === "mask") {
      ctx.mask.clearRect(0, 0, canvas.mask.width, canvas.mask.height);
    }
  }

  return (
    <div>
      <input type="file" onChange={handleUpload} accept="image/*" />
      <div>
        {image && (
          <canvas
            onMouseDown={handleDrawStart}
            onMouseMove={handleDrawing}
            onMouseUp={handleDrawEnd}
            onMouseLeave={handleDrawEnd}
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
