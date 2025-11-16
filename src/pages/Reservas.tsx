import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";





const VistaAgenda = () => {
    const { isAuthenticated, user } = useAuth();
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
    const fetchReservations = async () => {
        const q = query(collection(db, "bookings"), where("trabajadorId", "==", user?.id));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => doc.data());
        console.log("Reservas:", data);
        setData(data);
    };

    fetchReservations();
  }, [isAuthenticated, user?.id]);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Agenda</h1>
        <p>Aquí puedes ver y gestionar tus reservas.</p>
        <h2 className="text-xl font-bold">Reservas</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.map((reserva, index) => (
                <Card key={index} className="p-4">
                    <p><strong>Dirección:</strong> {reserva.direccion}</p>
                    <p><strong>Fecha:</strong> {new Date(reserva.fecha).toLocaleDateString()}</p>
                    <p><strong>Hora:</strong> {reserva.horaInicio} - {reserva.horaFin}</p>
                    <p><strong>Descripción:</strong> {reserva.infoAdicional}</p>
                    <p><strong>Estado:</strong> {reserva.estado}</p>
                    <Button className="">Aceptar</Button>
                    <Button className="ml-2">Rechazar</Button>
                </Card>
            ))}
        </div>
    </div>
  );
}

const Agenda = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <div className="container mx-auto px-4 py-8">
          <VistaAgenda />
        </div>
      </main>
      <Footer />
    </div>
  );

}

export default Agenda;