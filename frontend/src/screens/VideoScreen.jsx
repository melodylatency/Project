import React from "react";

const VideoScreen = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <video
        width="1280"
        height="720"
        controls
        controlsList="nofullscreen"
        disablePictureInPicture
      >
        <source src="videos/project3.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoScreen;
