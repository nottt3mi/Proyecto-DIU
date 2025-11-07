import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { db } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Booking = () => {
  const { id } = useParams(); // ID del trabajador
  const [formData, setFormData] = useState({
    fecha: "",
    horaInicio: "",
    horaFin: "",
    direccion: "",
    infoAdicional: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación simple
    if (!formData.fecha || !formData.horaInicio || !formData.direccion || !formData.horaFin) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await addDoc(collection(db, "bookings"), {
        trabajadorId: id,
        fecha: formData.fecha,
        horaInicio: formData.horaInicio,
        horaFin: formData.horaFin,
        direccion: formData.direccion,
        infoAdicional: formData.infoAdicional,
        creadoEn: serverTimestamp(),
      });

      toast({ title: "Agendado", description: "La visita ha sido registrada" });
      setFormData({ fecha: "", horaInicio: "", horaFin: "", direccion: "", infoAdicional: "" });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo agendar la visita", variant: "destructive" });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 mb-8">
      <h2 className="text-2xl font-bold mb-4">Agendar visita</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/*<div  className="size-min">*/}
        <div  className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="fecha">Fecha</Label>
            <Input
              id="fecha"
              type="date"
              value={formData.fecha}
              onChange={(e) => handleChange("fecha", e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="horaInicio">Hora Inicio</Label>
            <Input
              id="horaInicio"
              type="time"
              value={formData.horaInicio}
              onChange={(e) => handleChange("horaInicio", e.target.value)}
              required
            />
          </div>
          

          <div>
            <Label htmlFor="horaFin">Hora Fin</Label>
            <Input
              id="horaFin"
              type="time"
              value={formData.horaFin}
              onChange={(e) => handleChange("horaFin", e.target.value)}
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="direccion">Dirección</Label>
          <Input
            id="direccion"
            placeholder="Calle, número, ciudad"
            value={formData.direccion}
            onChange={(e) => handleChange("direccion", e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="infoAdicional">Información adicional</Label>
          <Textarea
            id="infoAdicional"
            placeholder="Detalles sobre el trabajo"
            value={formData.infoAdicional}
            onChange={(e) => handleChange("infoAdicional", e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Agendando..." : "Agendar"}
        </Button>
      </form>
    </div>
  );
};


const BookingPage = () => {
    return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Booking />
        
      </main>
      <Footer />
    </div>
  );
}


export default BookingPage;
