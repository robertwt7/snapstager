"use client";
import { FunctionComponent } from "react";
import { ImageBrushMask } from "src/components/ImageCanvasEditor/ImageBrushMask";

export const Main: FunctionComponent = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <ImageBrushMask />
    </div>
  );
};
