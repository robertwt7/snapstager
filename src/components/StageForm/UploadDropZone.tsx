"use client";
import {
  ChangeEvent,
  Dispatch,
  DragEvent,
  FunctionComponent,
  SetStateAction,
  useCallback,
  useState,
} from "react";

interface UploadDropzoneProps {
  setSelectedPhoto: Dispatch<SetStateAction<File | null>>;
  setOriginalPhoto: Dispatch<SetStateAction<string | null>>;
  setPhotoName: Dispatch<SetStateAction<string | null>>;
}
export const UploadDropZone: FunctionComponent<UploadDropzoneProps> = ({
  setSelectedPhoto,
  setOriginalPhoto,
  setPhotoName,
}) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = useCallback((e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
  }, []);
  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith("image/")) {
      const file = files[0];
      setSelectedPhoto(file);
      const fileUrl = URL.createObjectURL(file);
      setOriginalPhoto(fileUrl);
    }
  };
  const defaultClassNames =
    "flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed";
  const className = dragOver
    ? `${defaultClassNames} bg-gray-100 border-gray-400 dark:bg-gray-800 dark:border-gray-500`
    : `${defaultClassNames} border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-800`;

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    if (e.target.files[0].type.startsWith("image/")) {
      const file = e.target.files[0];
      setSelectedPhoto(file);
      const fileUrl = URL.createObjectURL(file);
      setOriginalPhoto(fileUrl);
      setPhotoName(file.name);
    }
  };
  return (
    <div className="flex w-full max-w-sm items-center justify-center">
      <label
        htmlFor="dropzone-file"
        className={className}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className="mb-3 h-10 w-10 text-gray-400"
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
          <p className="text-xs text-gray-500 dark:text-gray-400">PNG or JPG</p>
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
