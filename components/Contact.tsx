"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Send } from "lucide-react";

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "+251 959 15 55 55",
    link: "tel:+251959155555",
    color: "#0057D9",
    glow: "group-hover:shadow-[#0057D9]/15",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+251 959 15 55 55",
    link: "https://wa.me/251959155555",
    color: "#FFD400",
    glow: "group-hover:shadow-[#FFD400]/15",
  },
  {
    icon: Mail,
    label: "Email",
    value: "awloadvertising@gmail.com",
    link: "mailto:awloadvertising@gmail.com",
    color: "#FFD400",
    glow: "group-hover:shadow-[#FFD400]/15",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "Awlo Business Center, Addis Ababa",
    link: null,
    color: "#0057D9",
    glow: "group-hover:shadow-[#0057D9]/15",
  },
];

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your interest! We'll contact you shortly.");
  };

  return (
    <section id="contact" className="relative py-24 lg:py-32 bg-blue-theme grid-pattern overflow-hidden">
      {/* Background blurs */}
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-[#0057D9]/5 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[450px] h-[450px] bg-[#FFD400]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <span className="inline-block bg-[#0057D9]/10 text-[#0057D9] font-bold text-sm tracking-widest uppercase px-4 py-2 rounded-full mb-4 border border-[#0057D9]/10 shadow-sm">
            Contact Us
          </span>
          <h2 className="font-heading font-bold text-4xl lg:text-5xl text-gray-900 mb-6 tracking-tight">
            Let&apos;s Make Your Brand <span className="text-[#0057D9]">Shine</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed font-light">
            Ready to amplify your brand with LED billboard advertising? Get in touch
            with our team and let&apos;s start your campaign.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.98, filter: "blur(6px)" }}
            animate={inView ? { opacity: 1, x: 0, scale: 1, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="font-heading font-bold text-2xl text-gray-900 mb-8 tracking-tight">
              Get in Touch
            </h3>

            <div className="space-y-4 mb-10">
              {contactInfo.map((info, i) => {
                const Icon = info.icon;
                return (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                    animate={inView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                    whileHover={{ 
                      x: 6,
                      scale: 1.01,
                    }}
                    className="group"
                  >
                    {info.link ? (
                      <a
                        href={info.link}
                        className={`flex items-center gap-4 p-4 rounded-2xl bg-[#F0F5FF]/70 backdrop-blur-xl hover:bg-white border border-white/40 hover:border-[#0057D9]/30 hover:shadow-md transition-all duration-300 ${info.glow}`}
                      >
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner"
                          style={{ backgroundColor: info.color + "18" }}
                        >
                          <Icon size={22} style={{ color: info.color }} />
                        </motion.div>
                        <div>
                          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">
                            {info.label}
                          </div>
                          <div className="font-bold text-gray-900 group-hover:text-[#0057D9] transition-colors tracking-tight">
                            {info.value}
                          </div>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F0F5FF]/70 backdrop-blur-xl border border-white/40">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner"
                          style={{ backgroundColor: info.color + "18" }}
                        >
                          <Icon size={22} style={{ color: info.color }} />
                        </div>
                        <div>
                          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">
                            {info.label}
                          </div>
                          <div className="font-bold text-gray-900 tracking-tight">{info.value}</div>
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
              whileHover={{ scale: 1.02 }}
              className="relative rounded-3xl overflow-hidden h-64 border border-white/40 shadow-sm cursor-pointer transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#EFF4FF] to-[#DBEAFE] flex items-center justify-center">
                <div className="text-center z-10">
                  <MapPin size={36} className="text-[#0057D9] mx-auto mb-3 animate-bounce" />
                  <div className="text-gray-800 font-bold text-sm tracking-tight mb-1">
                    Awlo Business Center
                  </div>
                  <div className="text-gray-500 text-xs font-light">
                    Google Map location will be embedded here
                  </div>
                </div>
                {/* Glow map element */}
                <div className="absolute inset-0 bg-[#0057D9]/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.98, filter: "blur(6px)" }}
            animate={inView ? { opacity: 1, x: 0, scale: 1, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-[#F0F5FF]/70 backdrop-blur-xl rounded-3xl p-8 border border-white/40 shadow-sm"
          >
            <h3 className="font-heading font-bold text-2xl text-gray-900 mb-8 tracking-tight">
              Send Us a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide"
                  >
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 bg-white/80 text-gray-900 border border-gray-200/60 rounded-xl focus:bg-white focus:border-[#0057D9] focus:ring-4 focus:ring-[#0057D9]/10 outline-none transition-all duration-200 placeholder:text-gray-400 placeholder:font-light"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 bg-white/80 text-gray-900 border border-gray-200/60 rounded-xl focus:bg-white focus:border-[#0057D9] focus:ring-4 focus:ring-[#0057D9]/10 outline-none transition-all duration-200 placeholder:text-gray-400 placeholder:font-light"
                    placeholder="+251 911 234 567"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 bg-white/80 text-gray-900 border border-gray-200/60 rounded-xl focus:bg-white focus:border-[#0057D9] focus:ring-4 focus:ring-[#0057D9]/10 outline-none transition-all duration-200 placeholder:text-gray-400 placeholder:font-light"
                    placeholder="john@company.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="company"
                    className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide"
                  >
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-white/80 text-gray-900 border border-gray-200/60 rounded-xl focus:bg-white focus:border-[#0057D9] focus:ring-4 focus:ring-[#0057D9]/10 outline-none transition-all duration-200 placeholder:text-gray-400 placeholder:font-light"
                    placeholder="Your Company"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3.5 bg-white/80 text-gray-900 border border-gray-200/60 rounded-xl focus:bg-white focus:border-[#0057D9] focus:ring-4 focus:ring-[#0057D9]/10 outline-none transition-all duration-200 resize-none placeholder:text-gray-400 placeholder:font-light"
                  placeholder="Tell us about your advertising needs..."
                />
              </div>

              <motion.button
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 20px 40px -10px rgba(0,87,217,0.5)",
                  y: -2
                }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#0057D9] text-white font-bold text-base px-9 py-4 rounded-full transition-all duration-300"
              >
                Send Message
                <Send size={16} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


