"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { User, Building2, Mail, Phone, MessageCircle } from "lucide-react";
import { step1Schema, type Step1Data } from "@/types/quote";
import StepWrapper from "@/components/quote/shared/StepWrapper";
import FormField, { inputCn } from "@/components/quote/shared/FormField";

interface Props {
  defaultValues: Step1Data;
  onNext: (data: Step1Data) => void;
  direction: 1 | -1;
}

const contactMethods = [
  { value: "phone",    label: "Phone",    icon: Phone          },
  { value: "email",    label: "Email",    icon: Mail           },
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle  },
] as const;

export default function Step1Contact({ defaultValues, onNext, direction }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues,
  });

  const selectedMethod = watch("preferredContactMethod");

  return (
    <StepWrapper
      title="Contact Information"
      description="Tell us how to reach you. We'll use this to discuss your campaign."
      direction={direction}
    >
      <form onSubmit={handleSubmit(onNext)} noValidate className="space-y-5">
        {/* Row: Full Name + Company */}
        <div className="grid sm:grid-cols-2 gap-5">
          <FormField label="Full Name" required error={errors.fullName?.message}>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register("fullName")}
                type="text"
                placeholder="e.g. Abebe Kebede"
                className={`${inputCn(!!errors.fullName)} pl-10`}
              />
            </div>
          </FormField>

          <FormField label="Company Name" error={errors.companyName?.message} hint="Optional">
            <div className="relative">
              <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register("companyName")}
                type="text"
                placeholder="e.g. Abebe Enterprises"
                className={`${inputCn(!!errors.companyName)} pl-10`}
              />
            </div>
          </FormField>
        </div>

        {/* Row: Email + Phone */}
        <div className="grid sm:grid-cols-2 gap-5">
          <FormField label="Email Address" required error={errors.email?.message}>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register("email")}
                type="email"
                placeholder="you@company.com"
                className={`${inputCn(!!errors.email)} pl-10`}
              />
            </div>
          </FormField>

          <FormField label="Phone Number" required error={errors.phone?.message}>
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register("phone")}
                type="tel"
                placeholder="+251 959 15 55 55"
                className={`${inputCn(!!errors.phone)} pl-10`}
              />
            </div>
          </FormField>
        </div>

        {/* Preferred Contact Method */}
        <FormField
          label="Preferred Contact Method"
          required
          error={errors.preferredContactMethod?.message}
        >
          <div className="grid grid-cols-3 gap-3 mt-1">
            {contactMethods.map(({ value, label, icon: Icon }) => {
              const isSelected = selectedMethod === value;
              return (
                <motion.button
                  key={value}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setValue("preferredContactMethod", value, { shouldValidate: true })}
                  className={`flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border-2 transition-all duration-200 cursor-pointer
                    ${isSelected
                      ? "border-[#0057D9] bg-[#0057D9]/5 shadow-md"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-200
                    ${isSelected ? "bg-[#0057D9] text-white" : "bg-gray-100 text-gray-500"}`}
                  >
                    <Icon size={18} />
                  </div>
                  <span className={`text-xs font-semibold transition-colors duration-200
                    ${isSelected ? "text-[#0057D9]" : "text-gray-600"}`}
                  >
                    {label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </FormField>

        {/* Next */}
        <div className="pt-4 flex justify-end">
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
