"use client";
import { FunctionComponent } from "react";
import { StageForm } from "src/components/StageForm";

export const Main: FunctionComponent = () => {
  return (
    <StageForm />
    // <div className="h-screen flex flex-col overflow-hidden">
    //   <button
    //     onClick={() => setClear(clear + 1)}
    //     className="rounded-xl border-primary border text-sm text-white px-5 py-2 hover:bg-primary/90 bg-primary font-medium transition shadow-md"
    //   >
    //     Clear
    //   </button>
    //   <ImageCanvasEditor clear={clear} ref={canvasDrawingRef} />
    // </div>
  );
};
