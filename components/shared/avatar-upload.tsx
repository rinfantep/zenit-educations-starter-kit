"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Camera } from "lucide-react";
import { toast } from "sonner";

export function AvatarUpload({
  currentImage,
  name,
  onUploaded,
}: {
  currentImage?: string | null;
  name: string;
  onUploaded: (url: string) => void;
}) {
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!preset) {
    // Fallback elegante si Cloudinary no está configurado: solo mostramos iniciales
    return (
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-ink-900)] text-xl font-medium text-[var(--color-paper-50)] dark:bg-[var(--color-gold-500)] dark:text-[var(--color-ink-950)]">
        {name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")}
      </div>
    );
  }

  return (
    <CldUploadWidget
      uploadPreset={preset}
      options={{
        cropping: true,
        croppingAspectRatio: 1,
        multiple: false,
        maxFiles: 1,
        sources: ["local", "camera"],
      }}
      onSuccess={(result) => {
        if (
          result.info &&
          typeof result.info === "object" &&
          "secure_url" in result.info
        ) {
          onUploaded(result.info.secure_url as string);
          toast.success("Foto actualizada");
        }
      }}
    >
      {({ open }) => (
        <button
          type="button"
          onClick={() => open()}
          className="group relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[var(--color-ink-900)] text-xl font-medium text-[var(--color-paper-50)] dark:bg-[var(--color-gold-500)] dark:text-[var(--color-ink-950)]"
        >
          {currentImage ? (
            <img
              src={currentImage}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">
            <Camera size={18} className="text-white" />
          </div>
        </button>
      )}
    </CldUploadWidget>
  );
}
