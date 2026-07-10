"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CalendarDays, MessageSquare } from "lucide-react";
import { step4Schema, type Step4Data } from "@/types/quote";
import StepWrapper from "@/components/quote/shared/StepWrapper";
import FormField, { inputCn } from "@/components/quote/shared/FormField";

interface Props {
  defaultValues: Step4Data;
  onNext: (data: Step4Data) => void;
  onBack: () => void;
  direction: 1 | -1;
}

const INSTRUCTION_EXAMPLES = [
  "Start after payment confirmation",
  "Contact me before scheduling",
  "Run during holiday promotion",
];

export default function Step4Additional({ defaultValues, onNext, onBack, direction }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Step4Data>({
    resolver: zodResolver(step4Schema),
    defaultValues,
  });

  const instructionValue = watch("specialInstructions") ?? "";

  return (
    <StepWrapper
      title="Additional Information"
      description="Help us plan your campaign with a preferred start date and any special notes."
      direction={direction}
    >
      <form onSubmit={handleSubmit(onNext)} noValidate className="space-y-6">

        {/* Preferred Start Date */}
        <FormField
          label="Preferred Campaign Start Date"
          error={errors.preferredStartDate?.message}
          hint="Optional — we'll confirm the exact date after reviewing your request"
        >
          <div className="relative">
            <CalendarDays size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              {...register("preferredStartDate")}
              type="date"
              min={new Date().toISOString().split("T")[0]}
              className={`${inputCn(!!errors.preferredStartDate)} pl-10`}
            />
          </div>
        </FormField>

        {/* Special Instructions */}
        <FormField
          label="Special Instructions"
          error={errors.specialInstructions?.message}
          hint="Optional — any specific requirements for your campaign"
        >
          <div className="relative">
            <MessageSquare size={16} className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none" />
            <textarea
              {...register("specialInstructions")}
              rows={4}
              placeholder="e.g. Start after payment confirmation, contact me before scheduling..."
              className={`${inputCn(!!errors.specialInstructions)} pl-10 resize-none`}
            />
          </div>
          <div className="flex justify-end mt-1">
            <span className={`text-xs ${instructionValue.length > 480 ? "text-red-400" : "text-gray-400"}`}>
              {instructionValue.length}/500
            </span>
          </div>
        </FormField>

        {/* Quick suggestion chips */}
        <div>
          <p className="text-xs text-gray-400 mb-2">Quick suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {INSTRUCTION_EXAMPLES.map((ex) => (
              <motion.button
                key={ex}
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  setValue(
                    "specialInstructions",
                    instructionValue ? `${instructionValue}\n${ex}` : ex,
                    { shouldValidate: true }
                  )
                }
                className="text-xs px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 hover:border-[#0057D9] hover:bg-[#0057D9]/5 hover:text-[#0057D9] text-gray-500 transition-all duration-200 font-medium"
              >
                + {ex}
              </motion.button>
            ))}
          </div>
        </div>

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
            Review Request →
          </motion.button>
        </div>
      </form>
    </StepWrapper>
  );
}
