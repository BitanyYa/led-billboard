"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

// ── Validation schema ────────────────────────────────────────────
const contactSchema = z.object({
  name:    z.string().min(2, "Name must be at least 2 characters"),
  phone:   z.string().min(7, "Enter a valid phone number"),
  email:   z.string().email("Enter a valid email address"),
  company: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

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
    icon: MapPin,
    label: "Office",
    value: "Awlo Business Center, Addis Ababa",
    link: null,
    color: "#7C3AED",
  },
];

// ── Component ────────────────────────────────────────────────────
export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitStatus("idle");
    const { error } = await supabase.from("contacts").insert({
      name:    data.name,
      email:   data.email,
      phone:   data.phone,
      company: data.company || null,
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
    <section id="contact" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-[#0057D9]/10 text-[#0057D9] font-semibold text-sm tracking-widest uppercase px-4 py-2 rounded-full mb-4">
            Contact Us
          </span>
          <h2 className="font-heading font-bold text-4xl lg:text-5xl text-gray-900 mb-6">
            Let&apos;s Make Your Brand{" "}
            <span className="text-[#0057D9]">Shine</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Ready to amplify your brand with LED billboard advertising? Get in touch
            and let&apos;s start your campaign.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">

          {/* ── Left: Contact info ── */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h3 className="font-heading font-bold text-2xl text-gray-900 mb-8">
              Get in Touch
            </h3>

            <div className="space-y-4 mb-10">
              {contactInfo.map((info, i) => {
                const Icon = info.icon;
                return (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                  >
                    {info.link ? (
                      <a
                        href={info.link}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-[#F8FAFC] hover:bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 group"
                      >
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: info.color + "18" }}
                        >
                          <Icon size={22} style={{ color: info.color }} />
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">
                            {info.label}
                          </div>
                          <div className="font-semibold text-gray-900 group-hover:text-[#0057D9] transition-colors">
                            {info.value}
                          </div>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-gray-100">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: info.color + "18" }}
                        >
                          <Icon size={22} style={{ color: info.color }} />
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">
                            {info.label}
                          </div>
                          <div className="font-semibold text-gray-900">{info.value}</div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Map placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="relative rounded-2xl overflow-hidden h-64 border border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={32} className="text-gray-400 mx-auto mb-2" />
                  <div className="text-gray-500 text-sm">
                    Awlo Business Center, Addis Ababa
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Right: Contact form ── */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <h3 className="font-heading font-bold text-2xl text-gray-900 mb-8">
              Send Us a Message
            </h3>

            {/* Success banner */}
            {submitStatus === "success" && (
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl px-5 py-4 mb-6">
                <CheckCircle size={20} className="flex-shrink-0" />
                <div>
                  <div className="font-semibold text-sm">Message sent successfully!</div>
                  <div className="text-xs text-emerald-600 mt-0.5">
                    We&apos;ll get back to you within 24 hours.
                  </div>
                </div>
              </div>
            )}

            {/* Error banner */}
            {submitStatus === "error" && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 mb-6">
                <AlertCircle size={20} className="flex-shrink-0" />
                <div>
                  <div className="font-semibold text-sm">Something went wrong.</div>
                  <div className="text-xs text-red-600 mt-0.5">
                    Please try again or contact us directly by phone.
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    {...register("name")}
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200
                      ${errors.name
                        ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-gray-200 focus:border-[#0057D9] focus:ring-2 focus:ring-[#0057D9]/20"
                      }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    {...register("phone")}
                    id="phone"
                    type="tel"
                    placeholder="+251 959 15 55 55"
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200
                      ${errors.phone
                        ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-gray-200 focus:border-[#0057D9] focus:ring-2 focus:ring-[#0057D9]/20"
                      }`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    {...register("email")}
                    id="email"
                    type="email"
                    placeholder="john@company.com"
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200
                      ${errors.email
                        ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-gray-200 focus:border-[#0057D9] focus:ring-2 focus:ring-[#0057D9]/20"
                      }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    {...register("company")}
                    id="company"
                    type="text"
                    placeholder="Your Company"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0057D9] focus:ring-2 focus:ring-[#0057D9]/20 outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  {...register("message")}
                  id="message"
                  rows={6}
                  placeholder="Tell us about your advertising needs..."
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200 resize-none
                    ${errors.message
                      ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-gray-200 focus:border-[#0057D9] focus:ring-2 focus:ring-[#0057D9]/20"
                    }`}
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 bg-[#0057D9] hover:bg-[#003DA0] disabled:bg-[#0057D9]/60 disabled:cursor-not-allowed text-white font-semibold text-base px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:translate-y-0"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
