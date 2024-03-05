"use client";
import Image from "next/image";
import { FunctionComponent, useEffect, useState } from "react";
import { getAllImages } from "./actions";
import { supabase } from "src/services";
import { LoadingDots } from "src/components/LoadingDots";

export const ImageList: FunctionComponent = () => {
  const [lastId, setLastId] = useState<number | null>(null);
  const [images, setImages] = useState<{ id: number; url: string }[] | null>(
    [],
  );
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [endOfData, setEndOfData] = useState(false);
  useEffect(() => {
    const getImages = async () => {
      try {
        setLoading(true);
        const user = await supabase.auth.getUser();
        const userId = user?.data?.user?.id;
        if (userId) {
          const newImages = await getAllImages(userId, lastId);

          if (newImages && newImages.length > 0) {
            const combinedImages = images
              ? images.concat(newImages)
              : newImages;
            setImages(combinedImages.sort((a, b) => b.id - a.id));
          } else if (newImages && newImages.length === 0) {
            setEndOfData(true);
          }
        }
        setLoading(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.log("Error getting images from db: ", e);
        setError(e?.message ?? "Error getting images from db");
        setLoading(false);
      }
    };
    getImages();
  }, [lastId]);
  return (
    <div className="mt-4 mb-8 flex w-full flex-1 flex-col items-center justify-center px-4 text-center sm:mb-0">
      <h1 className="font-display mx-auto mb-8 max-w-4xl text-4xl font-bold tracking-normal sm:text-6xl">
        Images Generated
      </h1>
      {error && (
        <div
          className="mt-8 rounded-xl border border-red-400 bg-red-100 px-4 py-3 text-red-700"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {images?.length !== undefined && images.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <ImageView key={image.id} url={image.url} />
          ))}
        </div>
      )}
      {!endOfData && (
        <button
          disabled={loading}
          onClick={() => {
            if (images) setLastId(images[images.length - 1].id);
          }}
          className="mt-8 rounded-full bg-primary px-4 py-2 font-medium text-white transition hover:bg-blue-500/80"
        >
          {loading ? <LoadingDots color="white" style="large" /> : "Load More"}
        </button>
      )}
    </div>
  );
};

const ImageView: FunctionComponent<{ url: string }> = ({ url }) => {
  return (
    <div>
      <a href={url} target="_blank" rel="noreferrer">
        <Image
          alt="Generated Image"
          src={url}
          className="w-100 relative mt-2 h-auto cursor-zoom-in rounded-2xl sm:mt-0"
          width={600}
          height={475}
        />
      </a>
    </div>
  );
};
