import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/contexts/AuthContext";
import { Calendar, Clock, MapPin, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface Booking {
  id: string;
  trabajadorId: string;
  empleadorId: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  direccion: string;
  infoAdicional?: string;
  estado: string;
  creadoEn?: any;
}

const VistaAgendaEmployer = () => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [workers, setWorkers] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user?.id || user.tipo !== 'empleador') {
      setLoading(false);
      return;
    }

    const fetchReservations = async () => {
      try {
        const q = query(collection(db, "bookings"), where("empleadorId", "==", user.id));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Booking[];
        
        setBookings(data);

        // Obtener información de los trabajadores
        const workerIds = [...new Set(data.map(b => b.trabajadorId).filter(Boolean))];
        console.log("IDs de trabajadores encontrados:", workerIds);
        const workerData: Record<string, User> = {};
        
        for (const workerId of workerIds) {
          try {
            const workerDoc = await getDoc(doc(db, "users", workerId));
            if (workerDoc.exists()) {
              const workerInfo = workerDoc.data() as User;
              workerData[workerId] = workerInfo;
              console.log(`Trabajador cargado: ${workerInfo.nombre} ${workerInfo.apellido} (${workerId})`);
            } else {
              console.warn(`Trabajador no encontrado en Firestore: ${workerId}`);
            }
          } catch (error) {
            console.error(`Error al obtener trabajador ${workerId}:`, error);
          }
        }
        
        console.log("Trabajadores cargados:", Object.keys(workerData).length);
        setWorkers(workerData);
      } catch (error) {
        console.error("Error al obtener reservas:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las reservas",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [isAuthenticated, user?.id]);

  // Separar solicitudes pendientes y confirmadas
  const pendingRequests = useMemo(() => {
    return bookings.filter(b => b.estado === "pendiente de aceptación");
  }, [bookings]);

  const confirmedRequests = useMemo(() => {
    return bookings
      .filter(b => b.estado === "aceptada")
      .sort((a, b) => {
        // Ordenar por fecha y hora
        const dateA = new Date(`${a.fecha}T${a.horaInicio}`);
        const dateB = new Date(`${b.fecha}T${b.horaInicio}`);
        return dateA.getTime() - dateB.getTime();
      });
  }, [bookings]);

  if (!isAuthenticated || user?.tipo !== 'empleador') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Solo los empleadores pueden acceder a esta página</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Agenda</h1>
        <p className="text-muted-foreground">Gestiona tus solicitudes y reservas</p>
      </div>

      {/* Sección de Solicitudes Pendientes */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Solicitudes Pendientes</h2>
        {pendingRequests.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No tienes solicitudes pendientes</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingRequests.map((solicitud) => {
              const worker = workers[solicitud.trabajadorId];
              const initials = worker 
                ? `${worker.nombre.charAt(0)}${worker.apellido.charAt(0)}`.toUpperCase()
                : "??";
              
              // Log para depuración
              if (!worker && solicitud.trabajadorId) {
                console.warn(`Trabajador no encontrado para solicitud ${solicitud.id}. TrabajadorId: ${solicitud.trabajadorId}`);
              }
              
              return (
                <Card key={solicitud.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={worker?.foto} alt={worker ? `${worker.nombre} ${worker.apellido}` : "Trabajador"} />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {worker ? `${worker.nombre} ${worker.apellido}` : "Trabajador"}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {worker?.zona || "Sin ubicación"}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="w-fit">
                        {solicitud.estado}
                      </Badge>
                      {solicitud.trabajadorId && (
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="h-8"
                        >
                          <Link to={`/worker/${solicitud.trabajadorId}`}>
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Ver perfil
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(solicitud.fecha).toLocaleDateString('es-CL', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{solicitud.horaInicio} - {solicitud.horaFin}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{solicitud.direccion}</span>
                    </div>
                    {solicitud.infoAdicional && (
                      <div className="pt-2 border-t">
                        <p className="text-sm text-muted-foreground">
                          <strong>Detalles:</strong> {solicitud.infoAdicional}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Sección de Solicitudes Confirmadas */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Reservas Confirmadas</h2>
        {confirmedRequests.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No tienes reservas confirmadas</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {confirmedRequests.map((reserva) => {
              const worker = workers[reserva.trabajadorId];
              const initials = worker 
                ? `${worker.nombre.charAt(0)}${worker.apellido.charAt(0)}`.toUpperCase()
                : "??";
              
              // Log para depuración
              if (!worker && reserva.trabajadorId) {
                console.warn(`Trabajador no encontrado para reserva ${reserva.id}. TrabajadorId: ${reserva.trabajadorId}`);
              }
              
              const reservaDate = new Date(`${reserva.fecha}T${reserva.horaInicio}`);
              const isToday = reservaDate.toDateString() === new Date().toDateString();
              const isPast = reservaDate < new Date();
              
              return (
                <Card 
                  key={reserva.id} 
                  className={`hover:shadow-md transition-shadow ${
                    isToday ? 'border-primary border-2' : ''
                  } ${isPast ? 'opacity-60' : ''}`}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={worker?.foto} alt={worker ? `${worker.nombre} ${worker.apellido}` : "Trabajador"} />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {worker ? `${worker.nombre} ${worker.apellido}` : "Trabajador"}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {worker?.zona || "Sin ubicación"}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="w-fit">
                          Confirmada
                        </Badge>
                        {isToday && (
                          <Badge variant="secondary" className="w-fit">
                            Hoy
                          </Badge>
                        )}
                        {isPast && (
                          <Badge variant="outline" className="w-fit">
                            Pasada
                          </Badge>
                        )}
                      </div>
                      {reserva.trabajadorId && (
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="h-8"
                        >
                          <Link to={`/worker/${reserva.trabajadorId}`}>
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Ver perfil
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{new Date(reserva.fecha).toLocaleDateString('es-CL', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{reserva.horaInicio} - {reserva.horaFin}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{reserva.direccion}</span>
                    </div>
                    {reserva.infoAdicional && (
                      <div className="pt-2 border-t">
                        <p className="text-sm text-muted-foreground">
                          <strong>Detalles:</strong> {reserva.infoAdicional}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const AgendaEmployer = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <div className="container mx-auto px-4 py-8">
          <VistaAgendaEmployer />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AgendaEmployer;

