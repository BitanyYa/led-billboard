import { fetchSettings } from "@/lib/settings";
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

// Server component — fetches settings once per request, passes down as props.
// No extra client-side network call needed.
export default async function Home() {
  const settings = await fetchSettings();

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero      settings={settings} />
      <About     settings={settings} />
      <WhyUs />
      <Billboard settings={settings} />
      <Packages  settings={settings} />
      <HowItWorks />
      <Gallery />
      <Contact   settings={settings} />
      <Footer    settings={settings} />
    </main>
  );
}
