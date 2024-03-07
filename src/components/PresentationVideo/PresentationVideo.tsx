import { FunctionComponent } from "react";

export const PresentationVideo: FunctionComponent = () => {
  return (
    <div className="max-w-[940px]">
      <video className="aspect-video" controls>
        <source src="/Presentation.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};
