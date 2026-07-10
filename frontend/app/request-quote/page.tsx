"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProgressBar from "@/components/quote/shared/ProgressBar";
import Step1Contact from "@/components/quote/steps/Step1Contact";
import Step2Campaign from "@/components/quote/steps/Step2Campaign";
import Step3Upload from "@/components/quote/steps/Step3Upload";
import Step4Additional from "@/components/quote/steps/Step4Additional";
import Step5Review from "@/components/quote/steps/Step5Review";
import SuccessPage from "@/components/quote/SuccessPage";
import { submitQuoteRequest } from "@/lib/quoteService";
import {
  STEPS,
  type QuoteFormData,
  type Step1Data,
  type Step2Data,
  type Step3Data,
  type Step4Data,
} from "@/types/quote";

// ── Default empty state ──────────────────────────────────────────
const DEFAULT_FORM: QuoteFormData = {
  step1: {
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    preferredContactMethod: "phone",
  },
  step2: {
    package: "1_month",
    businessCategory: "Retail",
    campaignObjective: "Brand Awareness",
  },
  step3: { sendLater: false, adFile: null },
  step4: { preferredStartDate: "", specialInstructions: "" },
};

export default function RequestQuotePage() {
  const [currentStep, setCurrentStep]   = useState(1);
  const [direction,   setDirection]      = useState<1 | -1>(1);
  const [formData,    setFormData]       = useState<QuoteFormData>(DEFAULT_FORM);
  const [isSubmitting, setIsSubmitting]  = useState(false);
  const [submitted,   setSubmitted]      = useState(false);
  const [referenceNumber, setRefNum]     = useState("");

  // ── Navigate forward ──────────────────────────────────────────
  const goNext = () => {
    setDirection(1);
    setCurrentStep((s) => s + 1);
  };

  // ── Navigate backward ─────────────────────────────────────────
  const goBack = () => {
    setDirection(-1);
    setCurrentStep((s) => Math.max(1, s - 1));
  };

  // ── Step save helpers ─────────────────────────────────────────
  const saveStep1 = (data: Step1Data) => { setFormData((f) => ({ ...f, step1: data })); goNext(); };
  const saveStep2 = (data: Step2Data) => { setFormData((f) => ({ ...f, step2: data })); goNext(); };
  const saveStep3 = (data: Step3Data) => { setFormData((f) => ({ ...f, step3: data })); goNext(); };
  const saveStep4 = (data: Step4Data) => { setFormData((f) => ({ ...f, step4: data })); goNext(); };

  // ── Final submission ──────────────────────────────────────────
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const result = await submitQuoteRequest(formData);
    setIsSubmitting(false);
    if (result.success) {
      setRefNum(result.referenceNumber);
      setSubmitted(true);
    } else {
      alert(`Submission failed: ${result.error ?? "Unknown error. Please try again."}`);
    }
  };

  // ── Success screen ────────────────────────────────────────────
  if (submitted) return <SuccessPage referenceNumber={referenceNumber} />;

  return (
    <div className="min-h-screen bg-blue-theme grid-pattern relative">
      {/* Ambient glows */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#0057D9]/10 rounded-full blur-[120px]" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-[500px] h-[400px] bg-[#FFD400]/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-20">

        {/* ── Top bar ── */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <motion.span
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[#0057D9] transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
              Back to Home
            </motion.span>
          </Link>
        </div>

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <Link href="/">
            <img src="/logo.png" alt="AWLO Advert" className="h-16 w-auto mx-auto mb-5 drop-shadow-sm" />
          </Link>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-gray-900 mb-2">
            Request a Quote
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
            Complete the form below and our team will get back to you within 24 hours.
          </p>
        </motion.div>

        {/* ── Progress bar ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-10"
        >
          <ProgressBar steps={STEPS} currentStep={currentStep} />
        </motion.div>

        {/* ── Form card ── */}
        <div className="glass-panel rounded-3xl shadow-xl p-6 sm:p-8 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <div key={currentStep}>
              {currentStep === 1 && (
                <Step1Contact
                  defaultValues={formData.step1}
                  onNext={saveStep1}
                  direction={direction}
                />
              )}
              {currentStep === 2 && (
                <Step2Campaign
                  defaultValues={formData.step2}
                  onNext={saveStep2}
                  onBack={goBack}
                  direction={direction}
                />
              )}
              {currentStep === 3 && (
                <Step3Upload
                  defaultValues={formData.step3}
                  onNext={saveStep3}
                  onBack={goBack}
                  direction={direction}
                />
              )}
              {currentStep === 4 && (
                <Step4Additional
                  defaultValues={formData.step4}
                  onNext={saveStep4}
                  onBack={goBack}
                  direction={direction}
                />
              )}
              {currentStep === 5 && (
                <Step5Review
                  formData={formData}
                  onBack={goBack}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  direction={direction}
                />
              )}
            </div>
          </AnimatePresence>
        </div>

        {/* ── Footer note ── */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Your information is kept private and will only be used to process your advertising request.
        </p>
      </div>
    </div>
  );
}
