"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, FileVideo, Image as ImageIcon, Info } from "lucide-react";
import { step3Schema, type Step3Data, ACCEPTED_MIME_TYPES } from "@/types/quote";
import StepWrapper from "@/components/quote/shared/StepWrapper";
import FormField from "@/components/quote/shared/FormField";

interface Props {
  defaultValues: Step3Data;
  onNext: (data: Step3Data) => void;
  onBack: () => void;
  direction: 1 | -1;
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Step3Upload({ defaultValues, onNext, onBack, direction }: Props) {
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Step3Data>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(step3Schema) as any,
    defaultValues: { sendLater: defaultValues.sendLater ?? false, adFile: defaultValues.adFile ?? null },
  });

  const sendLater = watch("sendLater");
  const adFile    = watch("adFile");
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File | null) => {
      setValue("adFile", file, { shouldValidate: true });
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    },
    [setValue]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const isImage = adFile?.type.startsWith("image/");
  const isVideo = adFile?.type === "video/mp4";

  return (
    <StepWrapper
      title="Upload Advertisement"
      description="Upload the creative file that will be displayed on our LED billboard."
      direction={direction}
    >
      <form onSubmit={handleSubmit(onNext)} noValidate className="space-y-6">

        {/* Send Later Checkbox */}
        <motion.label
          whileTap={{ scale: 0.99 }}
          className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200
            ${sendLater ? "border-[#0057D9] bg-[#0057D9]/5" : "border-gray-200 bg-white hover:border-gray-300"}`}
        >
          <div className="relative mt-0.5 flex-shrink-0">
            <input
              type="checkbox"
              className="sr-only"
              checked={sendLater}
              onChange={(e) => {
                setValue("sendLater", e.target.checked, { shouldValidate: true });
                if (e.target.checked) handleFile(null);
              }}
            />
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200
              ${sendLater ? "bg-[#0057D9] border-[#0057D9]" : "border-gray-300 bg-white"}`}
            >
              {sendLater && (
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  viewBox="0 0 12 10" width="10" height="10" fill="none"
                >
                  <path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
              )}
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-800">I will send my advertisement later</div>
            <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              Check this if your creative is not ready yet. Our team will follow up with you after reviewing your request.
            </div>
          </div>
        </motion.label>

        {/* Upload Area */}
        <AnimatePresence>
          {!sendLater && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FormField
                label="Advertisement File"
                required
                error={(errors as { adFile?: { message?: string } }).adFile?.message}
                hint="Accepted: MP4, JPG, JPEG, PNG — Max 500 MB"
              >
                <AnimatePresence mode="wait">
                  {adFile ? (
                    /* File preview */
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="relative rounded-2xl border-2 border-[#0057D9] bg-[#0057D9]/5 overflow-hidden"
                    >
                      {isImage && preview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={preview} alt="Ad preview" className="w-full h-52 object-contain bg-gray-50" />
                      ) : isVideo ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-3">
                          <div className="w-14 h-14 bg-[#0057D9]/10 rounded-2xl flex items-center justify-center">
                            <FileVideo size={28} className="text-[#0057D9]" />
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-gray-800 text-sm">{adFile.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{formatBytes(adFile.size)}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 gap-3">
                          <ImageIcon size={28} className="text-[#0057D9]" />
                          <div className="text-sm font-semibold text-gray-800">{adFile.name}</div>
                        </div>
                      )}

                      {/* Remove button */}
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleFile(null)}
                        className="absolute top-3 right-3 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-md transition-colors"
                      >
                        <X size={14} className="text-white" />
                      </motion.button>
                    </motion.div>
                  ) : (
                    /* Drop zone */
                    <motion.label
                      key="dropzone"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={onDrop}
                      className={`flex flex-col items-center justify-center gap-4 py-12 px-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200
                        ${isDragging
                          ? "border-[#0057D9] bg-[#0057D9]/8 scale-[1.01]"
                          : "border-gray-300 hover:border-[#0057D9] hover:bg-[#0057D9]/3 bg-gray-50/60"
                        }`}
                    >
                      <input
                        type="file"
                        className="sr-only"
                        accept={ACCEPTED_MIME_TYPES.join(",")}
                        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                      />
                      <motion.div
                        animate={{ y: isDragging ? -4 : 0 }}
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-200
                          ${isDragging ? "bg-[#0057D9] text-white" : "bg-white border border-gray-200 text-gray-400"}`}
                      >
                        <Upload size={28} />
                      </motion.div>
                      <div className="text-center">
                        <div className="text-sm font-semibold text-gray-700">
                          {isDragging ? "Drop your file here" : "Drag & drop or click to upload"}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">MP4, JPG, JPEG, PNG up to 500 MB</div>
                      </div>
                    </motion.label>
                  )}
                </AnimatePresence>
              </FormField>

              {/* Helper info */}
              <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3 mt-3">
                <Info size={14} className="text-[#0057D9] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  Your uploaded advertisement will <strong>not</strong> be displayed on this website.
                  It will be reviewed by the AWLO team and scheduled for display on the physical LED billboard.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="pt-2 flex items-center justify-between">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="text-gray-500 hover:text-gray-800 font-semibold text-sm px-6 py-3.5 rounded-full border-2 border-gray-200 hover:border-gray-300 transition-all"
          >
            ← Back
          </motion.button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#0057D9] hover:bg-[#003DA0] text-white font-bold px-8 py-3.5 rounded-full transition-colors shadow-lg shadow-[#0057D9]/25 text-sm"
          >
            Continue →
          </motion.button>
        </div>
      </form>
    </StepWrapper>
  );
}
