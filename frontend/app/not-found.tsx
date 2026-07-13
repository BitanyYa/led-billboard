import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020B1A] via-[#030F24] to-[#061630] flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#0057D9]/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative text-center">
        {/* 404 number */}
        <div className="font-bold text-[160px] leading-none text-[#0057D9]/20 select-none">
          404
        </div>

        {/* Message */}
        <h1 className="text-white font-bold text-3xl sm:text-4xl -mt-6 mb-4">
          Page Not Found
        </h1>
        <p className="text-white/50 text-base sm:text-lg max-w-md mx-auto mb-10">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* CTA */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#0057D9] hover:bg-[#003DA0] text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-[0_8px_30px_rgba(0,87,217,0.4)] hover:shadow-[0_12px_40px_rgba(0,87,217,0.6)] hover:-translate-y-1"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
