"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import {
  step2Schema,
  type Step2Data,
  PACKAGES,
  BUSINESS_CATEGORIES,
  CAMPAIGN_OBJECTIVES,
} from "@/types/quote";
import StepWrapper from "@/components/quote/shared/StepWrapper";
import FormField from "@/components/quote/shared/FormField";

interface Props {
  defaultValues: Step2Data;
  onNext: (data: Step2Data) => void;
  onBack: () => void;
  direction: 1 | -1;
}

export default function Step2Campaign({ defaultValues, onNext, onBack, direction }: Props) {
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues,
  });

  const selectedPackage   = watch("package");
  const selectedCategory  = watch("businessCategory");
  const selectedObjective = watch("campaignObjective");

  return (
    <StepWrapper
      title="Campaign Details"
      description="Choose your advertising package and tell us about your campaign goals."
      direction={direction}
    >
      <form onSubmit={handleSubmit(onNext)} noValidate className="space-y-8">

        {/* Advertising Package */}
        <FormField label="Advertising Package" required error={errors.package?.message}>
          <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-1">
            {PACKAGES.map((pkg) => {
              const isSelected = selectedPackage === pkg.value;
              return (
                <motion.button
                  key={pkg.value}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setValue("package", pkg.value, { shouldValidate: true })}
                  className={`relative flex flex-col items-center gap-1 py-4 px-2 rounded-2xl border-2 transition-all duration-200 cursor-pointer text-center
                    ${isSelected
                      ? "border-[#0057D9] bg-[#0057D9]/5 shadow-md"
                      : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-4 h-4 bg-[#0057D9] rounded-full flex items-center justify-center"
                    >
                      <Check size={9} className="text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                  <span className={`font-heading font-bold text-base ${isSelected ? "text-[#0057D9]" : "text-gray-800"}`}>
                    {pkg.label}
                  </span>
                  <span className={`text-[11px] font-semibold ${isSelected ? "text-[#0057D9]/70" : "text-gray-500"}`}>
                    {pkg.price}
                  </span>
                  <span className={`text-[10px] ${isSelected ? "text-[#0057D9]/50" : "text-gray-400"}`}>
                    {pkg.displays} displays
                  </span>
                </motion.button>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 mt-1.5">All prices are before 15% VAT.</p>
        </FormField>

        {/* Business Category */}
        <FormField label="Business Category" required error={errors.businessCategory?.message}>
          <div className="flex flex-wrap gap-2 mt-1">
            {BUSINESS_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <motion.button
                  key={cat}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setValue("businessCategory", cat, { shouldValidate: true })}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-200
                    ${isSelected
                      ? "border-[#0057D9] bg-[#0057D9] text-white shadow-md"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  {cat}
                </motion.button>
              );
            })}
          </div>
        </FormField>

        {/* Campaign Objective */}
        <FormField label="Campaign Objective" required error={errors.campaignObjective?.message}>
          <div className="flex flex-wrap gap-2 mt-1">
            {CAMPAIGN_OBJECTIVES.map((obj) => {
              const isSelected = selectedObjective === obj;
              return (
                <motion.button
                  key={obj}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setValue("campaignObjective", obj, { shouldValidate: true })}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-200
                    ${isSelected
                      ? "border-[#FFD400] bg-[#FFD400] text-gray-900 shadow-md"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  {obj}
                </motion.button>
              );
            })}
          </div>
        </FormField>

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
