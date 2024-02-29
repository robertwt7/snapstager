"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { UrlBuilder } from "@bytescale/sdk";
import { UploadWidgetConfig } from "@bytescale/upload-widget";
import { UploadDropzone } from "@bytescale/upload-widget-react";
import { CompareSlider } from "../../components/CompareSlider";
import LoadingDots from "../LoadingDots";
import ResizablePanel from "src/components/ResizablePanel";
import Toggle from "../Toggle";
import appendNewToName from "../../utils/appendNewToName";
import downloadPhoto from "../../utils/downloadPhoto";
import DropDown from "../../components/DropDown";
import { roomType, rooms, themeType, themes } from "../../utils/dropdownTypes";
import { app } from "src/env";
import { User } from "@supabase/supabase-js";
import { supabase } from "src/services";
import { ImageCanvasEditor } from "../ImageCanvasEditor";
import { exportMask, getImageDimensions } from "./helpers";
import { uploadImage } from "src/services/cloudflare";

const options: (userId?: string) => UploadWidgetConfig = (userId?: string) => ({
  apiKey: app.NEXT_PUBLIC_UPLOAD_API_KEY,
  maxFileCount: 1,
  mimeTypes: ["image/jpeg", "image/png", "image/jpg"],
  editor: { images: { crop: false } },
  styles: {
    colors: {
      primary: "#172D3F", // Primary buttons & links
      error: "#d23f4d", // Error messages
    },
  },
  path: {
    folderPath: `/${userId}` ?? "/uploads",
  },
});

export const StageForm: FunctionComponent = () => {
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [restoredLoaded, setRestoredLoaded] = useState<boolean>(false);
  const [sideBySide, setSideBySide] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [theme, setTheme] = useState<themeType>("Cozy");
  const [room, setRoom] = useState<roomType>("Living Room");
  const [user, setUser] = useState<User | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasDrawingRef = useRef<HTMLCanvasElement>(null);
  const [clear, setClear] = useState(0);

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await supabase.auth.getUser();
        if (user?.data !== null) {
          setUser(user.data.user);
        }
      } catch (error) {
        // TODO: handle error with snackbar
      }
    };
    getUser();
  }, []);

  const UploadDropZone = () => (
    <UploadDropzone
      options={options(user?.id)}
      onUpdate={({ uploadedFiles }) => {
        if (uploadedFiles.length !== 0) {
          const image = uploadedFiles[0];
          const imageName = image.originalFile.originalFileName;
          const imageUrl = UrlBuilder.url({
            accountId: image.accountId,
            filePath: image.filePath,
            options: {
              transformation: "preset",
              transformationPreset: "thumbnail",
            },
          });
          setPhotoName(imageName);
          setOriginalPhoto(imageUrl);
          generatePhoto(imageUrl);
        }
      }}
      width="670px"
      height="250px"
    />
  );

  const UploadDropZoneCloudFlare = () => {
    const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files === null) return;
      const formData = new FormData();
      formData.append("file", e.target.files[0]);

      try {
        const result = await uploadImage(formData);
        if (result?.success) {
          // Set original photo here
          setOriginalPhoto(result?.result.variants[0] ?? null);
          console.log("Image uploaded: ", result);
        }
      } catch (e) {
        console.log("Upload image error: ", e);
      }
    };
    return (
      <div className="flex items-center justify-center w-full max-w-sm">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-10 h-10 mb-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG or JPG
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={handleInputChange}
          />
        </label>
      </div>
    );
  };

  const generateMaskedPhoto = async (url: string) => {
    try {
      const imageDimension = await getImageDimensions(url);
      const image = exportMask(
        canvasDrawingRef.current,
        imageDimension.width,
        imageDimension.height,
      );
      return image;
    } catch (e) {
      // TODO: Snackbar for error
    }
  };

  const generatePhoto = useCallback(
    async (fileUrl: string) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setLoading(true);
      try {
        const maskedImage = await generateMaskedPhoto(originalPhoto ?? "");
        const res = await fetch("/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageUrl: fileUrl,
            imageMaskUrl: maskedImage,
            theme,
            room,
          }),
        });

        const newPhoto = await res.json();
        if (res.status !== 200) {
          setError(newPhoto);
        } else {
          setRestoredImage(newPhoto[1]);
        }
      } catch (e) {
        // TODO: Snackbar
      }
      setTimeout(() => {
        setLoading(false);
      }, 1300);
    },
    [room, theme, originalPhoto],
  );

  return (
    <div className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4 sm:mb-0 mb-8">
      <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-normal sm:text-6xl mb-5">
        Stage your room
      </h1>
      <ResizablePanel>
        <AnimatePresence mode="wait">
          <motion.div className="flex justify-between items-center w-full flex-col mt-4">
            {!restoredImage && (
              <>
                <div className="space-y-4 w-full max-w-sm">
                  <div className="flex mt-3 items-center space-x-3">
                    <Image
                      src="/number-1.svg"
                      width={30}
                      height={30}
                      alt="1 icon"
                    />
                    <p className="text-left font-medium">
                      Choose your room theme.
                    </p>
                  </div>
                  <DropDown
                    theme={theme}
                    setTheme={(newTheme) => setTheme(newTheme as typeof theme)}
                    themes={themes}
                  />
                </div>
                <div className="space-y-4 w-full max-w-sm">
                  <div className="flex mt-10 items-center space-x-3">
                    <Image
                      src="/number-2.svg"
                      width={30}
                      height={30}
                      alt="1 icon"
                    />
                    <p className="text-left font-medium">
                      Choose your room type.
                    </p>
                  </div>
                  <DropDown
                    theme={room}
                    setTheme={(newRoom) => setRoom(newRoom as typeof room)}
                    themes={rooms}
                  />
                </div>
                <div className="mt-4 w-full max-w-sm">
                  <div className="flex mt-6 w-96 items-center space-x-3">
                    <Image
                      src="/number-3.svg"
                      width={30}
                      height={30}
                      alt="1 icon"
                    />
                    <p className="text-left font-medium">
                      Upload a picture of your room.
                    </p>
                  </div>
                </div>
              </>
            )}
            {restoredImage && (
              <div>
                Here&apos;s your remodeled <b>{room.toLowerCase()}</b> in the{" "}
                <b>{theme.toLowerCase()}</b> theme!{" "}
              </div>
            )}
            <div
              className={`${
                restoredLoaded ? "visible mt-6 -ml-8" : "invisible"
              }`}
            >
              <Toggle
                className={`${restoredLoaded ? "visible mb-6" : "invisible"}`}
                sideBySide={sideBySide}
                setSideBySide={(newVal) => setSideBySide(newVal)}
              />
            </div>
            {restoredLoaded && sideBySide && (
              <CompareSlider
                original={originalPhoto!}
                restored={restoredImage!}
              />
            )}
            {!originalPhoto && <UploadDropZoneCloudFlare />}
            {originalPhoto && !restoredImage && (
              <div className="relative">
                <Image
                  alt="original photo"
                  ref={imageRef}
                  src={originalPhoto}
                  className="rounded-2xl w-100 h-auto"
                  width={600}
                  height={475}
                />
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                  <div className="relative w-full h-full">
                    <button
                      onClick={() => {
                        setClear(clear + 1);
                      }}
                      className="z-10 absolute top-4 left-4 rounded-xl border-primary border text-sm text-white px-5 py-2 hover:bg-primary/90 bg-primary font-medium transition shadow-md"
                    >
                      Clear
                    </button>
                    <div className="opacity-40 w-full h-full">
                      <ImageCanvasEditor ref={canvasDrawingRef} clear={clear} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {restoredImage && originalPhoto && !sideBySide && (
              <div className="flex sm:space-x-4 sm:flex-row flex-col">
                <div>
                  <h2 className="mb-1 font-medium text-lg">Original Room</h2>
                  <Image
                    alt="original photo"
                    src={originalPhoto}
                    className="rounded-2xl relative w-full h-96"
                    width={475}
                    height={475}
                  />
                </div>
                <div className="sm:mt-0 mt-8">
                  <h2 className="mb-1 font-medium text-lg">Generated Room</h2>
                  <a href={restoredImage} target="_blank" rel="noreferrer">
                    <Image
                      alt="restored photo"
                      src={restoredImage}
                      className="rounded-2xl relative sm:mt-0 mt-2 cursor-zoom-in w-full h-96"
                      width={475}
                      height={475}
                      onLoadingComplete={() => setRestoredLoaded(true)}
                    />
                  </a>
                </div>
              </div>
            )}
            {loading && (
              <button
                disabled
                className="bg-primary rounded-full text-white font-medium px-4 pt-2 pb-3 mt-8 w-40"
              >
                <span className="pt-4">
                  <LoadingDots color="white" style="large" />
                </span>
              </button>
            )}
            {error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mt-8"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <div className="flex space-x-2 justify-center">
              {originalPhoto && !loading && (
                <button
                  onClick={() => {
                    setOriginalPhoto(null);
                    setRestoredImage(null);
                    setRestoredLoaded(false);
                    setError(null);
                  }}
                  className="bg-primary rounded-full text-white font-medium px-4 py-2 mt-8 hover:bg-blue-500/80 transition"
                >
                  Generate New Room
                </button>
              )}
              {restoredLoaded && (
                <button
                  onClick={() => {
                    downloadPhoto(restoredImage!, appendNewToName(photoName!));
                  }}
                  className="bg-white rounded-full text-black border font-medium px-4 py-2 mt-8 hover:bg-gray-100 transition"
                >
                  Download Generated Room
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </ResizablePanel>
    </div>
  );
};
