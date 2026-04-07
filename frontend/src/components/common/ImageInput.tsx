import { useRef, useState } from "react";
import { FieldError, Label } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Image02Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  label: string;
  placeholder: string;
  isInvalid?: boolean;
  errorMessage?: string;
  onChange: (file: File) => void;
  value?: string | null;
  className?: string;
  ratio?: "landscape" | "portrait" | "square";
  classNames?: {
    preview?: string;
    overlay?: string;
    label?: string;
  };
}

export default function ImageUpload({
  label,
  placeholder,
  onChange,
  value = null,
  className,
  ratio = "landscape",
  isInvalid,
  errorMessage,
  classNames,
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(value);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const previewFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
      onChange(file);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      previewFile(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) previewFile(file);
  };
  const aspect =
    ratio === "landscape"
      ? "aspect-video"
      : ratio === "portrait"
        ? "aspect-[3/4]"
        : "aspect-square";

  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      <Label className={cn(classNames?.label)}>{label}</Label>

      <div
        onClick={handleClick}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`w-full relative ${aspect} overflow-hidden rounded-lg group flex items-center justify-center cursor-pointer transition 
        ${isDragging ? "brightness-125" : ""}`}
      >
        <input
          hidden
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
        />

        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="preview"
              className={cn("w-full h-full object-cover group-hover:scale-105 transition-smooth duration-500", classNames?.preview)}
            />
            <div className={cn("absolute z-40 inset-0 w-full h-full flex items-center flex-col justify-center rounded-lg bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-smooth duration-300", classNames?.overlay)}>
              <HugeiconsIcon
                size={32}
                icon={Image02Icon}
                className="text-white"
              />
              <p className="text-white">{placeholder}</p>
            </div>
          </>
        ) : (
          <div className="flex relative group-hover:brightness-75 transition-smooth duration-300 w-full h-full justify-center rounded-xl flex-col border-3 border-dashed items-center gap-2 text-muted">
            <HugeiconsIcon size={40} icon={Image02Icon} />
            <p>{placeholder}</p>
            <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden rounded-xl">
              <img
                alt="placeholder"
                className="w-full h-full object-cover grayscale"
                data-alt="subtle macro texture of vintage botanical paper or pressed dried flowers with fine grain and natural organic patterns"
                src="/img/placeholder.png"
              />
            </div>
          </div>
        )}
      </div>
      {isInvalid && errorMessage && (
        <FieldError>{errorMessage}</FieldError>
      )}
    </div>
  );
}
