"use client";

import { motion } from "framer-motion";
import { User, Briefcase, FileVideo, CalendarDays, Edit2, Send } from "lucide-react";
import type { QuoteFormData } from "@/types/quote";
import { PACKAGES } from "@/types/quote";
import StepWrapper from "@/components/quote/shared/StepWrapper";

interface Props {
  formData: QuoteFormData;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  direction: 1 | -1;
}

function ReviewSection({
  icon: Icon,
  title,
  children,
  onEdit,
  color,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  onEdit: () => void;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: color + "18" }}
          >
            <Icon size={16} style={{ color }} />
          </div>
          <span className="font-heading font-bold text-gray-800 text-sm">{title}</span>
        </div>
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEdit}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#0057D9] hover:text-[#003DA0] transition-colors"
        >
          <Edit2 size={12} />
          Edit
        </motion.button>
      </div>

      {/* Content */}
      <div className="px-5 py-4 space-y-2.5">{children}</div>
    </motion.div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs text-gray-400 font-medium flex-shrink-0 w-36">{label}</span>
      <span className="text-sm text-gray-800 font-medium text-right">{value}</span>
    </div>
  );
}

export default function Step5Review({ formData, onBack, onSubmit, isSubmitting, direction }: Props) {
  const { step1, step2, step3, step4 } = formData;

  const packageLabel = PACKAGES.find((p) => p.value === step2.package)?.label ?? step2.package;
  const packagePrice = PACKAGES.find((p) => p.value === step2.package)?.price ?? "";

  const contactMethodLabel =
    step1.preferredContactMethod === "whatsapp"
      ? "WhatsApp"
      : step1.preferredContactMethod.charAt(0).toUpperCase() + step1.preferredContactMethod.slice(1);

  return (
    <StepWrapper
      title="Review Your Request"
      description="Please review your details before submitting. You can go back to edit any section."
      direction={direction}
    >
      <div className="space-y-4">

        {/* Contact Info */}
        <ReviewSection icon={User} title="Contact Information" onEdit={onBack} color="#0057D9">
          <ReviewRow label="Full Name"       value={step1.fullName} />
          <ReviewRow label="Company"         value={step1.companyName} />
          <ReviewRow label="Email"           value={step1.email} />
          <ReviewRow label="Phone"           value={step1.phone} />
          <ReviewRow label="Preferred Contact" value={contactMethodLabel} />
        </ReviewSection>

        {/* Campaign Details */}
        <ReviewSection icon={Briefcase} title="Campaign Details" onEdit={onBack} color="#7C3AED">
          <ReviewRow label="Package"      value={`${packageLabel} — ${packagePrice} (excl. VAT)`} />
          <ReviewRow label="Category"     value={step2.businessCategory} />
          <ReviewRow label="Objective"    value={step2.campaignObjective} />
        </ReviewSection>

        {/* Advertisement */}
        <ReviewSection icon={FileVideo} title="Advertisement" onEdit={onBack} color="#059669">
          {step3.sendLater ? (
            <p className="text-sm text-amber-600 font-medium">
              Will send advertisement later after speaking with the AWLO team.
            </p>
          ) : step3.adFile ? (
            <>
              <ReviewRow label="File Name" value={step3.adFile.name} />
              <ReviewRow
                label="File Size"
                value={`${(step3.adFile.size / (1024 * 1024)).toFixed(2)} MB`}
              />
              <ReviewRow label="File Type" value={step3.adFile.type} />
            </>
          ) : null}
        </ReviewSection>

        {/* Additional Info */}
        <ReviewSection icon={CalendarDays} title="Additional Information" onEdit={onBack} color="#D97706">
          <ReviewRow label="Start Date"    value={step4.preferredStartDate ?? "Not specified"} />
          <ReviewRow label="Instructions"  value={step4.specialInstructions ?? "None"} />
        </ReviewSection>

        {/* VAT notice */}
        <p className="text-xs text-gray-400 text-center">
          All prices shown are before 15% VAT. Final pricing will be confirmed by our team.
        </p>

        {/* Navigation */}
        <div className="pt-2 flex items-center justify-between">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            disabled={isSubmitting}
            className="text-gray-500 hover:text-gray-800 font-semibold text-sm px-6 py-3.5 rounded-full border-2 border-gray-200 hover:border-gray-300 transition-all disabled:opacity-50"
          >
            ← Back
          </motion.button>

          <motion.button
            type="button"
            whileHover={!isSubmitting ? { scale: 1.02, y: -1 } : {}}
            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            onClick={onSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 bg-[#0057D9] hover:bg-[#003DA0] disabled:bg-[#0057D9]/60 disabled:cursor-not-allowed text-white font-bold px-8 py-3.5 rounded-full transition-colors shadow-lg shadow-[#0057D9]/25 text-sm"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Submitting…
              </>
            ) : (
              <>
                <Send size={16} />
                Submit Request
              </>
            )}
          </motion.button>
        </div>
      </div>
    </StepWrapper>
  );
}
