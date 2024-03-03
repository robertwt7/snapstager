"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { CompareSlider } from "../../components/CompareSlider";
import LoadingDots from "../LoadingDots";
import ResizablePanel from "src/components/ResizablePanel";
import Toggle from "../Toggle";
import appendNewToName from "../../utils/appendNewToName";
import { UploadDropZone } from "./UploadDropZone";
import downloadPhoto from "../../utils/downloadPhoto";
import DropDown from "../../components/DropDown";
import { roomType, rooms, themeType, themes } from "../../utils/dropdownTypes";
import { User } from "@supabase/supabase-js";
import { supabase } from "src/services";
import { ImageCanvasEditor } from "../ImageCanvasEditor";
import { dataURLtoBlob, exportMask, getImageDimensions } from "./helpers";
import { updateImageDb, uploadImage } from "src/services/cloudflare";
import { ImageType } from "@prisma/client";

export const StageForm: FunctionComponent = () => {
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
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

  const handleSubmit = async () => {
    if (selectedPhoto === null) return;
    const formData = new FormData();
    formData.append("file", selectedPhoto);

    try {
      if (user !== null && originalPhoto !== null) {
        const result = await uploadImage(formData);
        if (result?.success) {
          const updateImageStatus = await updateImageDb(
            result?.result?.variants[0],
            user.id,
            ImageType.ORIGINAL,
          );

          const maskedPhotoUrl = await generateMaskedPhoto(originalPhoto);
          const maskedPhotoBlob = await dataURLtoBlob(maskedPhotoUrl ?? "");
          if (maskedPhotoBlob !== undefined) {
            const maskedPhotoFile = new File(
              [maskedPhotoBlob],
              `${photoName}-mask.png`,
              { type: "image/png" },
            );
            const formDataMasked = new FormData();
            formDataMasked.append("file", maskedPhotoFile);
            const resultMasked = await uploadImage(formDataMasked, user.id);

            if (resultMasked?.success && updateImageStatus !== undefined) {
              const updateImageMaskedStatus = await updateImageDb(
                resultMasked?.result?.variants[0],
                user.id,
                ImageType.MASK,
                updateImageStatus?.id,
              );
            }
            if (result !== undefined && resultMasked !== undefined) {
              const generatePhotoResult = await generatePhoto(
                result.result.variants[0],
                resultMasked.result.variants[0],
              );
              if (generatePhotoResult !== undefined) {
                const updateImageGeneratedStatus = await updateImageDb(
                  generatePhotoResult,
                  user.id,
                  ImageType.FINAL,
                  updateImageStatus?.id,
                );
              }
            }
          }
        }
      }
    } catch (e) {
      console.log("Upload image error: ", e);
    }
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
      console.log("Error at maskedPhoto generation: ", e);
    }
  };

  const generatePhoto = useCallback(
    async (fileUrl: string, maskedFileUrl: string) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setLoading(true);
      try {
        const res = await fetch("/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageUrl: fileUrl,
            imageMaskUrl: maskedFileUrl,
            theme,
            room,
          }),
        });

        const newPhoto = await res.json();
        if (res.status !== 200) {
          setError(newPhoto);
        } else {
          setRestoredImage(newPhoto[1]);
          return newPhoto[1];
        }
      } catch (e) {
        // TODO: Snackbar for error
        console.log("Error at generatePhoto to backend", e);
      }
      setTimeout(() => {
        setLoading(false);
      }, 1300);
    },
    [room, theme],
  );

  return (
    <div className="mt-4 mb-8 flex w-full flex-1 flex-col items-center justify-center px-4 text-center sm:mb-0">
      <h1 className="font-display mx-auto mb-5 max-w-4xl text-4xl font-bold tracking-normal sm:text-6xl">
        Stage your room
      </h1>
      <ResizablePanel>
        <AnimatePresence mode="wait">
          <motion.div className="mt-4 flex w-full flex-col items-center justify-between">
            {!restoredImage && (
              <>
                <div className="w-full max-w-sm space-y-4">
                  <div className="mt-3 flex items-center space-x-3">
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
                <div className="w-full max-w-sm space-y-4">
                  <div className="mt-10 flex items-center space-x-3">
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
                  <div className="mt-6 flex w-96 items-center space-x-3">
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
            {!originalPhoto && (
              <UploadDropZone
                setSelectedPhoto={setSelectedPhoto}
                setOriginalPhoto={setOriginalPhoto}
                setPhotoName={setPhotoName}
              />
            )}
            {originalPhoto && !restoredImage && (
              <div className="relative">
                <Image
                  alt="original photo"
                  ref={imageRef}
                  src={originalPhoto}
                  className="w-100 h-auto rounded-2xl"
                  width={600}
                  height={475}
                />
                <div className="absolute top-0 left-0 h-full w-full overflow-hidden">
                  <div className="relative h-full w-full">
                    <div className="absolute top-4 left-4 z-10 flex flex-row space-x-4">
                      <button
                        onClick={() => {
                          setClear(clear + 1);
                        }}
                        className="rounded-xl border border-primary bg-primary px-5 py-2 text-sm font-medium text-white shadow-md transition hover:bg-primary/90"
                      >
                        Clear
                      </button>
                    </div>

                    <div className="h-full w-full opacity-40">
                      <ImageCanvasEditor ref={canvasDrawingRef} clear={clear} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {restoredImage && originalPhoto && !sideBySide && (
              <div className="flex flex-col sm:flex-row sm:space-x-4">
                <div>
                  <h2 className="mb-1 text-lg font-medium">Original Room</h2>
                  <Image
                    alt="original photo"
                    src={originalPhoto}
                    className="relative h-96 w-full rounded-2xl"
                    width={475}
                    height={475}
                  />
                </div>
                <div className="mt-8 sm:mt-0">
                  <h2 className="mb-1 text-lg font-medium">Generated Room</h2>
                  <a href={restoredImage} target="_blank" rel="noreferrer">
                    <Image
                      alt="restored photo"
                      src={restoredImage}
                      className="relative mt-2 h-96 w-full cursor-zoom-in rounded-2xl sm:mt-0"
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
                className="mt-8 w-40 rounded-full bg-primary px-4 pt-2 pb-3 font-medium text-white"
              >
                <span className="pt-4">
                  <LoadingDots color="white" style="large" />
                </span>
              </button>
            )}
            {error && (
              <div
                className="mt-8 rounded-xl border border-red-400 bg-red-100 px-4 py-3 text-red-700"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <div className="flex justify-center space-x-2">
              {originalPhoto && !loading && (
                <>
                  <button
                    onClick={() => {
                      setOriginalPhoto(null);
                      setSelectedPhoto(null);
                      setRestoredImage(null);
                      setRestoredLoaded(false);
                      setError(null);
                    }}
                    className="mt-8 rounded-full bg-primary px-4 py-2 font-medium text-white transition hover:bg-blue-500/80"
                  >
                    Clear Room
                  </button>
                  <button
                    onClick={() => {
                      generateMaskedPhoto(originalPhoto);
                    }}
                    className="mt-8 rounded-full bg-primary px-4 py-2 font-medium text-white transition hover:bg-blue-500/80"
                  >
                    Submit for Staging
                  </button>
                </>
              )}
              {restoredLoaded && (
                <button
                  onClick={() => {
                    downloadPhoto(restoredImage!, appendNewToName(photoName!));
                  }}
                  className="mt-8 rounded-full border bg-white px-4 py-2 font-medium text-black transition hover:bg-gray-100"
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
