import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServicesExplore from "@/components/ServicesExplore";

const SelectService = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <ServicesExplore />
      </main>
      <Footer />
    </div>
  );
};

export default SelectService;
