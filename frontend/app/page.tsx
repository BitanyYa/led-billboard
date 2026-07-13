import { fetchSettings, fetchPackages } from "@/lib/settings";
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

// Server component — fetches settings + packages once per request.
export default async function Home() {
  const [settings, packages] = await Promise.all([
    fetchSettings(),
    fetchPackages(),
  ]);

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero      settings={settings} />
      <About     settings={settings} />
      <WhyUs />
      <Billboard settings={settings} />
      <Packages  settings={settings} packages={packages} />
      <HowItWorks />
      <Gallery />
      <Contact   settings={settings} />
      <Footer    settings={settings} />
    </main>
  );
}
