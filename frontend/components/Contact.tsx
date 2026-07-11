"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Phone, Mail, MapPin, MessageCircle,
  Send, CheckCircle, AlertCircle, User,
  Tag, MessageSquare,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// ── Validation schema ────────────────────────────────────────────
const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name is too long"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 7,
      "Enter a valid phone number"
    ),
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters")
    .max(120, "Subject is too long"),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(2000, "Message must be under 2000 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

// ── Subject suggestions ──────────────────────────────────────────
const SUBJECT_SUGGESTIONS = [
  "Advertising Package Inquiry",
  "Pricing Information",
  "Billboard Availability",
  "Partnership Opportunity",
  "General Question",
];

// ── Contact info cards ───────────────────────────────────────────
const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "+251 959 15 55 55",
    link: "tel:+251959155555",
    color: "#0057D9",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+251 959 15 55 55",
    link: "https://wa.me/251959155555",
    color: "#25D366",
  },
  {
    icon: Mail,
    label: "Email",
    value: "awloadvertising@gmail.com",
    link: "mailto:awloadvertising@gmail.com",
    color: "#DC2626",
  },
  {
    icon: MessageCircle,
    label: "Telegram",
    value: "+251 959 15 55 55",
    link: "https://t.me/+251959155555",
    color: "#229ED9",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "Awlo Business Center, Addis Ababa",
    link: "https://www.google.com/maps/place/Awlo+Business+center/data=!4m2!3m1!1s0x0:0xa2de1724cdb233da?sa=X&ved=1t:2428&ictx=111",
    color: "#7C3AED",
  },
];

// ── Input class helper ───────────────────────────────────────────
function inputCn(hasError: boolean) {
  return [
    "w-full px-4 py-3 rounded-xl border text-sm bg-white outline-none transition-all duration-200",
    hasError
      ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-gray-200 focus:border-[#0057D9] focus:ring-2 focus:ring-[#0057D9]/20",
  ].join(" ");
}

// ── Component ────────────────────────────────────────────────────
export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "", email: "", phone: "", subject: "", message: "",
    },
  });

  const messageValue = watch("message") ?? "";
  const subjectValue = watch("subject") ?? "";

  const onSubmit = async (data: ContactFormData) => {
    setSubmitStatus("idle");
    const { error } = await supabase.from("contacts").insert({
      name:    data.name,
      email:   data.email,
      phone:   data.phone || null,
      subject: data.subject,
      message: data.message,
    });

    if (error) {
      console.error("Supabase error:", error.message);
      setSubmitStatus("error");
      return;
    }

    setSubmitStatus("success");
    reset();
  };

  return (
    <section id="contact" className="relative py-24 lg:py-32 bg-blue-theme grid-pattern overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[400px] bg-[#0057D9]/6 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-[#FFD400]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-[#0057D9]/10 text-[#0057D9] font-bold text-sm tracking-widest uppercase px-4 py-2 rounded-full mb-4 border border-[#0057D9]/15">
            Contact Us
          </span>
          <h2 className="font-heading font-bold text-4xl lg:text-5xl text-gray-900 mb-5 tracking-tight">
            Let&apos;s Make Your Brand{" "}
            <span className="text-[#0057D9]">Shine</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed font-light">
            Have a question or ready to advertise? Send us a message and we&apos;ll
            get back to you within 24 hours.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* ── Left: Contact info ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="font-heading font-bold text-xl text-gray-900 mb-6">
              Reach Us Directly
            </h3>

            <div className="space-y-3 mb-10">
              {contactInfo.map((info, i) => {
                const Icon = info.icon;
                return (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
                  >
                    {info.link ? (
                      <a
                        href={info.link}
                        className="flex items-center gap-4 p-4 rounded-2xl glass-panel hover:shadow-md transition-all duration-300 group border border-white/60 hover:border-[#0057D9]/20"
                      >
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                          style={{ backgroundColor: info.color + "15" }}
                        >
                          <Icon size={20} style={{ color: info.color }} />
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">
                            {info.label}
                          </div>
                          <div className="font-semibold text-gray-800 text-sm group-hover:text-[#0057D9] transition-colors">
                            {info.value}
                          </div>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-center gap-4 p-4 rounded-2xl glass-panel border border-white/60">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: info.color + "15" }}
                        >
                          <Icon size={20} style={{ color: info.color }} />
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">
                            {info.label}
                          </div>
                          <div className="font-semibold text-gray-800 text-sm">
                            {info.value}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Google Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.55 }}
              className="relative rounded-2xl overflow-hidden h-56 border border-white/60 shadow-sm"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d982.4522739821397!2d38.74689!3d9.02497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xa2de1724cdb233da!2sAwlo%20Business%20center!5e0!3m2!1sen!2set!4v1720000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Awlo Business Center Location"
                className="absolute inset-0 w-full h-full"
              />
              {/* Open in Maps overlay button */}
              <a
                href="https://www.google.com/maps/place/Awlo+Business+center/@9.02497,38.74689,17z"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md hover:bg-[#0057D9] hover:text-white transition-colors duration-200 flex items-center gap-1.5"
              >
                <MapPin size={11} />
                Open in Maps
              </a>
            </motion.div>


          </motion.div>

          {/* ── Right: Contact form ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="glass-panel rounded-3xl border border-white/60 shadow-xl p-6 sm:p-8">
              <h3 className="font-heading font-bold text-xl text-gray-900 mb-6">
                Send Us a Message
              </h3>

              {/* ── Status banners ── */}
              <AnimatePresence mode="wait">
                {submitStatus === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl px-5 py-4 mb-6"
                  >
                    <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-sm">Message sent successfully!</div>
                      <div className="text-xs text-emerald-600 mt-0.5">
                        Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                      </div>
                    </div>
                  </motion.div>
                )}
                {submitStatus === "error" && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 mb-6"
                  >
                    <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-sm">Something went wrong.</div>
                      <div className="text-xs text-red-600 mt-0.5">
                        Please try again or contact us directly by phone.
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

                {/* Row: Full Name + Email */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Full Name <span className="text-[#0057D9]">*</span>
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input
                        {...register("name")}
                        id="name"
                        type="text"
                        placeholder="Abebe Kebede"
                        className={`${inputCn(!!errors.name)} pl-10`}
                      />
                    </div>
                    <AnimatePresence>
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-red-500 text-xs mt-1 font-medium"
                        >
                          {errors.name.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Email Address <span className="text-[#0057D9]">*</span>
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input
                        {...register("email")}
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        className={`${inputCn(!!errors.email)} pl-10`}
                      />
                    </div>
                    <AnimatePresence>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-red-500 text-xs mt-1 font-medium"
                        >
                          {errors.email.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Phone (optional) */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Phone Number
                    <span className="text-gray-400 font-normal ml-1">(optional)</span>
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      {...register("phone")}
                      id="phone"
                      type="tel"
                      placeholder="+251 959 15 55 55"
                      className={`${inputCn(!!errors.phone)} pl-10`}
                    />
                  </div>
                  <AnimatePresence>
                    {errors.phone && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-red-500 text-xs mt-1 font-medium"
                      >
                        {errors.phone.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Subject <span className="text-[#0057D9]">*</span>
                  </label>
                  <div className="relative">
                    <Tag size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      {...register("subject")}
                      id="subject"
                      type="text"
                      placeholder="e.g. Advertising Package Inquiry"
                      className={`${inputCn(!!errors.subject)} pl-10`}
                    />
                  </div>
                  <AnimatePresence>
                    {errors.subject && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-red-500 text-xs mt-1 font-medium"
                      >
                        {errors.subject.message}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Subject suggestions */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {SUBJECT_SUGGESTIONS.map((s) => (
                      <motion.button
                        key={s}
                        type="button"
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setValue("subject", s, { shouldValidate: true })}
                        className={`text-xs px-3 py-1 rounded-full border transition-all duration-150 font-medium
                          ${subjectValue === s
                            ? "bg-[#0057D9] text-white border-[#0057D9]"
                            : "bg-white text-gray-500 border-gray-200 hover:border-[#0057D9] hover:text-[#0057D9]"
                          }`}
                      >
                        {s}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700">
                      Message <span className="text-[#0057D9]">*</span>
                    </label>
                    <span className={`text-xs font-medium ${messageValue.length > 1800 ? "text-red-400" : "text-gray-400"}`}>
                      {messageValue.length}/2000
                    </span>
                  </div>
                  <div className="relative">
                    <MessageSquare size={15} className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none" />
                    <textarea
                      {...register("message")}
                      id="message"
                      rows={5}
                      placeholder="Tell us about your advertising needs, any questions you have, or how we can help you..."
                      className={`${inputCn(!!errors.message)} pl-10 resize-none`}
                    />
                  </div>
                  <AnimatePresence>
                    {errors.message && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-red-500 text-xs mt-1 font-medium"
                      >
                        {errors.message.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={!isSubmitting ? { scale: 1.02, y: -1 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#0057D9] hover:bg-[#003DA0] disabled:bg-[#0057D9]/60 disabled:cursor-not-allowed text-white font-bold text-sm px-8 py-4 rounded-full transition-colors shadow-lg shadow-[#0057D9]/25 hover:shadow-xl hover:shadow-[#0057D9]/30"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={16} />
                    </>
                  )}
                </motion.button>

                <p className="text-center text-xs text-gray-400">
                  We typically respond within 24 hours on business days.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
