export const exportMask = (
  canvasRef: HTMLCanvasElement,
  originalWidth: number,
  originalHeight: number,
): string => {
  // Create a new canvas element
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = originalWidth;
  exportCanvas.height = originalHeight;

  // Get the context of the new canvas
  const ctx = exportCanvas.getContext("2d");
  if (ctx !== null) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, originalWidth, originalHeight);
    // Draw the mask canvas onto the new canvas with resizing
    ctx.drawImage(canvasRef, 0, 0, originalWidth, originalHeight);
  }

  // Export the canvas to an image format, e.g., PNG
  const maskDataURL = exportCanvas.toDataURL("image/png");

  // You can now use maskDataURL for further processing or save it
  return maskDataURL;
};

export const dataURLtoBlob = async (dataUrl: string) => {
  try {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    return blob;
  } catch (e) {
    console.log("Error at dataURLtoBlob", e);
  }
};

// Example usage
/**
const imageUrl = "https://example.com/path/to/image.jpg";
getImageDimensions(imageUrl)
  .then((dimensions) => {
    console.log("Width:", dimensions.width, "Height:", dimensions.height);
  })
  .catch((error) => {
    console.error(error);
  });
 */
export const getImageDimensions = (
  url: string,
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    // Set up a function to be called once the image has loaded
    img.onload = function () {
      resolve({ width: img.width, height: img.height });
    };

    // Set up a function to handle errors in loading the image
    img.onerror = function () {
      reject(new Error("Failed to load image at " + url));
    };

    // Set the source of the image to the URL
    img.src = url;
  });
};
