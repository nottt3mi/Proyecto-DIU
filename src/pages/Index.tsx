import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import Benefits from "@/components/Benefits";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <div id="servicios">
          <Services />
        </div>
        <div id="como-funciona">
          <HowItWorks />
        </div>
        <div id="beneficios">
          <Benefits />
        </div>
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
