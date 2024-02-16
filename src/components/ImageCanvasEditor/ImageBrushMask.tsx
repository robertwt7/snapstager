"use client";
import React, {
  MouseEvent,
  TouchEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { LazyBrush, Point } from "lazy-brush";
import { getCatenaryCurve, drawResult } from "catenary-curve";

const DRAW_MAX_DPI = 2;

const styleVariables = {
  colorPrimary: "rgb(234,88,12)",
  colorBlack: "#0a0302",
  colorCatenary: "#0a0302",
};

export const ImageBrushMask = ({
  brushRadius = 12.5,
  lazyRadius = 10,
  friction = 10,
  clear = 0,
  enabled = true,
}) => {
  const [dimensions, setDimensions] = useState({
    width: 1280,
    height: 768,
    dpi: 2,
  });
  const isDrawing = useRef(false);
  const isPressing = useRef(false);
  const points = useRef<Point[]>([]);

  const mouseX = useRef(dimensions.width / 2);
  const mouseY = useRef(dimensions.height / 2);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasInterfaceRef = useRef<HTMLCanvasElement>(null);
  const canvasDrawingRef = useRef<HTMLCanvasElement>(null);
  const canvasTempRef = useRef<HTMLCanvasElement>(null);
  const canvasGridRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();

  const lazy = useRef(
    new LazyBrush({
      enabled: true,
      radius: lazyRadius,
      initialPoint: { x: mouseX.current, y: mouseY.current },
    }),
  ).current;

  function midPointBtw(p1: Point, p2: Point) {
    return {
      x: p1.x + (p2.x - p1.x) / 2,
      y: p1.y + (p2.y - p1.y) / 2,
    };
  }

  useEffect(() => {
    if (
      canvasDrawingRef.current !== null &&
      canvasTempRef.current !== null &&
      canvasInterfaceRef.current !== null
    ) {
      setCanvasSize(
        canvasDrawingRef.current,
        dimensions.width,
        dimensions.height,
        DRAW_MAX_DPI,
      );
      setCanvasSize(
        canvasTempRef.current,
        dimensions.width,
        dimensions.height,
        DRAW_MAX_DPI,
      );
      setCanvasSize(
        canvasInterfaceRef.current,
        dimensions.width,
        dimensions.height,
        3,
      );
    }
    drawGrid();
    rafRef.current = requestAnimationFrame(loop);

    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
          dpi: Math.min(window.devicePixelRatio, 2),
        });
        mouseX.current = containerRef.current.clientWidth / 2;
        mouseY.current = containerRef.current.clientHeight / 2;
      }
    };
    const observeCanvas = new ResizeObserver(() => {
      setTimeout(() => {
        handleResize();
      }, 500);
    });
    observeCanvas.observe(containerRef.current);
    window.addEventListener("resize", handleResize);
    return () => {
      observeCanvas.disconnect();
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    clearCanvas();
  }, [dimensions.width, dimensions.height]);

  useEffect(() => {
    if (clear) {
      clearCanvas();
    }
  }, [clear]);

  useEffect(() => {
    if (enabled) {
      lazy.enable();
    } else {
      lazy.disable();
    }
  }, [enabled]);

  useEffect(() => {
    lazy.setRadius(lazyRadius);
  }, [lazyRadius]);

  const onMouseDown = () => (isPressing.current = true);

  const onPointerUp = () => {
    isDrawing.current = false;
    isPressing.current = false;
    points.current = [];
    drawToCanvas();
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (containerRef.current === null) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.current = clientX - rect.left;
    mouseY.current = clientY - rect.top;
  };

  const onMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    handlePointerMove(e.clientX, e.clientY);
  };

  const onTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    handlePointerMove(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    lazy.update({ x: mouseX.current, y: mouseY.current }, { both: true });
    isPressing.current = true;
  };

  const onTouchMove = (e: TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    handlePointerMove(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
  };

  const onTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    onPointerUp();
    const brush = lazy.getBrushCoordinates();
    lazy.update({ x: brush.x, y: brush.y }, { both: true });
  };

  const drawGrid = () => {
    if (canvasGridRef.current !== null) {
      const canvas = canvasGridRef.current;
      const ctx = canvas.getContext("2d");
      const size = 24 * dimensions.dpi;
      canvas.width = size;
      canvas.height = size;
      if (ctx === null) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgb(214, 211, 209)";
      ctx.lineWidth = dimensions.dpi;

      // Draw vertical line
      ctx.beginPath();
      ctx.moveTo(0, size - 0.5);
      ctx.lineTo(size, size - 0.5);
      ctx.stroke();

      // Draw horizontal line
      ctx.beginPath();
      ctx.moveTo(size - 0.5, 0);
      ctx.lineTo(size - 0.5, size);
      ctx.stroke();

      const gridElement = gridRef.current;
      if (gridElement) {
        const png = canvas.toDataURL();
        gridElement.style.backgroundImage = `url(${png})`;
        gridElement.style.backgroundSize = `24px 24px`;
      }
    }
  };

  const drawToCanvas = () => {
    const canvas = canvasTempRef.current;
    if (canvas === null) return;
    const ctx = canvas.getContext("2d");
    const drawDpi = Math.min(dimensions.dpi, DRAW_MAX_DPI);
    const w = canvas.width / drawDpi;
    const h = canvas.height / drawDpi;

    canvasDrawingRef?.current?.getContext("2d")?.drawImage(canvas, 0, 0, w, h);
    ctx?.clearRect(0, 0, w, h);
  };

  const clearCanvas = () => {
    if (canvasDrawingRef.current === null) return;
    if (canvasTempRef.current === null) return;
    const canvasDrawing = canvasDrawingRef.current.getContext("2d");
    const canvasTemp = canvasTempRef.current.getContext("2d");
    canvasDrawing?.clearRect(
      0,
      0,
      dimensions.width * dimensions.dpi,
      dimensions.height * dimensions.dpi,
    );
    canvasTemp?.clearRect(
      0,
      0,
      dimensions.width * dimensions.dpi,
      dimensions.height * dimensions.dpi,
    );
  };

  const setCanvasSize = (
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    maxDpi: number,
    forceDpi = null,
  ) => {
    const targetDpi = forceDpi || Math.min(dimensions.dpi, maxDpi);
    canvas.width = width * targetDpi;
    canvas.height = height * targetDpi;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    ctx?.scale(targetDpi, targetDpi);
  };

  const loop = () => {
    drawInterface();
    updateLazyBrush();
    rafRef.current = requestAnimationFrame(loop);
  };

  const drawInterface = () => {
    if (canvasInterfaceRef.current === null) {
      return;
    }
    const ctx = canvasInterfaceRef.current.getContext("2d");
    const brush = lazy.getBrushCoordinates();
    if (ctx === null) return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw brush point
    ctx.beginPath();
    ctx.fillStyle = styleVariables.colorPrimary;
    ctx.arc(brush.x, brush.y, brushRadius, 0, Math.PI * 2, true);
    ctx.fill();

    // Draw mouse point
    ctx.beginPath();
    ctx.fillStyle = styleVariables.colorBlack;
    ctx.arc(mouseX.current, mouseY.current, 4, 0, Math.PI * 2, true);
    ctx.fill();

    //Draw catharina
    if (lazy.isEnabled()) {
      ctx.beginPath();
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";

      const pullOffset = Math.max(lazy.distance - lazy.radius, -0.1);

      const stretchFactor = pullOffset / lazy.radius + 1;
      ctx.setLineDash([5 * stretchFactor, 5 * stretchFactor]);
      ctx.strokeStyle =
        pullOffset > -0.1 ? styleVariables.colorCatenary : "rgba(0,0,0,0.3)";
      const result = getCatenaryCurve(
        brush,
        { x: mouseX.current, y: mouseY.current },
        lazyRadius,
      );
      drawResult(result, ctx);
      ctx.stroke();
    }

    // Draw mouse point
    ctx.beginPath();
    ctx.fillStyle = "#222222";
    ctx.arc(brush.x, brush.y, 2, 0, Math.PI * 2, true);
    ctx.fill();
  };

  const updateLazyBrush = () => {
    const hasChanged = lazy.update(
      { x: mouseX.current, y: mouseY.current },
      { friction: isDrawing ? friction / 100 : 1 },
    );

    const isDisabled = !lazy.isEnabled();
    const hasMoved = lazy.brushHasMoved();

    if (!hasMoved) {
      // return
    }

    if (canvasTempRef.current === null) {
      return;
    }
    const ctx = canvasTempRef.current.getContext("2d")!;
    if (ctx === null) {
      return;
    }
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = styleVariables.colorPrimary;

    const isPressingValue = isPressing.current;
    const isDrawingValue = isDrawing.current;
    if (
      (isPressingValue && !isDrawingValue) ||
      (isDisabled && isPressingValue)
    ) {
      isDrawing.current = true;
      const newPoint = lazy.getBrushCoordinates();
      points.current = [...points.current, newPoint];
    }

    if (isDrawingValue) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.lineWidth = brushRadius * 2;
      const newPoint = lazy.getBrushCoordinates();
      points.current = [...points.current, newPoint];

      let p1 = points.current[0];
      let p2 = points.current[1];

      ctx.moveTo(p2.x, p2.y);
      ctx.beginPath();

      for (let i = 1, len = points.current.length; i < len; i++) {
        // we pick the point between pi+1 & pi+2 as the
        // end point and p1 as our control point
        const midPoint = midPointBtw(p1, p2);
        ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
        p1 = points.current[i];
        p2 = points.current[i + 1];
      }
      // Draw last line as a straight line while
      // we wait for the next point to be able to calculate
      // the bezier control point
      ctx.lineTo(p1.x, p1.y);
      ctx.stroke();
    }
  };

  return (
    <div
      className="relative z-10 w-full h-full border-t border-stone-300 md:border-t-0"
      ref={containerRef}
    >
      <div className="absolute z-50 top-4 left-4">
        <button
          onClick={() => clearCanvas()}
          className="rounded-xl border-primary border text-sm text-white px-5 py-2 hover:bg-primary/90 bg-primary font-medium transition shadow-md"
        >
          Clear
        </button>
      </div>
      <canvas
        className="canvas z-40"
        ref={canvasInterfaceRef}
        onMouseDown={onMouseDown}
        onMouseUp={onPointerUp}
        onMouseMove={onMouseMove}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      ></canvas>
      <canvas className="canvas z-30" ref={canvasTempRef}></canvas>
      <canvas className="canvas z-20" ref={canvasDrawingRef}></canvas>
      <div className="canvas z-10" ref={gridRef}></div>
      <canvas className="hidden" ref={canvasGridRef}></canvas>
    </div>
  );
};
