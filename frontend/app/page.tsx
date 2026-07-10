import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import WhyUs from "@/components/WhyUs";
import Billboard from "@/components/Billboard";
import Packages from "@/components/Packages";
import HowItWorks from "@/components/HowItWorks";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <WhyUs />
      <Billboard />
      <Packages />
      <HowItWorks />
      <Gallery />
      <Contact />
      <Footer />
    </main>
  );
}
