import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/firebase";
import { doc, getDoc, collection, getDocs, addDoc, updateDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, MapPin, ArrowLeft, Building2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// ---- Formulario de reseña para empleador ----
const ReviewForm = ({ employerId, onNewReview }: { employerId: string; onNewReview: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [estrellas, setEstrellas] = useState(5);
  const [comentario, setComentario] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para dejar una reseña",
        variant: "destructive"
      });
      return;
    }

    if (user.tipo !== 'trabajador') {
      toast({
        title: "Error",
        description: "Solo los trabajadores pueden dejar reseñas a empleadores",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewsRef = collection(db, "users", employerId, "reviews");

      // Guardar nueva reseña
      await addDoc(reviewsRef, {
        autorId: user.id,
        estrellas,
        comentario,
        fecha: new Date()
      });

      // Recalcular promedio y cantidad
      const snap = await getDocs(reviewsRef);
      let total = 0;
      snap.forEach(d => total += d.data().estrellas);
      const promedio = total / snap.size;

      await updateDoc(doc(db, "users", employerId), {
        calificaciones: promedio,
        reseñas: snap.size
      });

      setComentario("");
      setEstrellas(5);

      toast({
        title: "Reseña enviada",
        description: "Tu reseña ha sido publicada correctamente",
      });

      if (onNewReview) onNewReview();
    } catch (error) {
      console.error("Error guardando reseña:", error);
      toast({
        title: "Error",
        description: "No se pudo enviar la reseña. Por favor intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.tipo !== 'trabajador') {
    return (
      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          Solo los trabajadores pueden dejar reseñas a empleadores.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="estrellas">Calificación (1-5)</Label>
        <Input
          id="estrellas"
          type="number"
          min="1"
          max="5"
          value={estrellas}
          onChange={(e) => setEstrellas(Number(e.target.value))}
          className="w-20"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="comentario">Comentario</Label>
        <Textarea
          id="comentario"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Escribe tu reseña..."
          rows={4}
          required
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Enviar Reseña"}
      </Button>
    </form>
  );
};

const EmployerPublicProfile = () => {
  const { id } = useParams();
  const [employer, setEmployer] = useState<User | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployer = async () => {
    if (!id) return;
    try {
      const docSnap = await getDoc(doc(db, "users", id));
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.tipo === "empleador") {
          setEmployer(data as User);
        }
      }
    } catch (error) {
      console.error("Error fetching employer:", error);
    }
  };

  const fetchReviews = async () => {
    if (!id) return;
    try {
      const snap = await getDocs(collection(db, "users", id, "reviews"));
      const revs = snap.docs.map((d) => d.data());
      setReviews(revs);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchEmployer();
      await fetchReviews();
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (!employer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Empleador no encontrado</p>
            <Button asChild className="mt-4">
              <Link to="/">Volver al inicio</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const initials = `${employer.nombre.charAt(0)}${employer.apellido.charAt(0)}`.toUpperCase();

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link to="/reservas" className="inline-flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" /> Volver a agenda
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* --- Perfil principal --- */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src={employer.foto} alt={`${employer.nombre} ${employer.apellido}`} />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <CardTitle>{employer.nombre} {employer.apellido}</CardTitle>
              <CardDescription>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Building2 className="h-4 w-4" />
                  <Badge variant="secondary">Empleador</Badge>
                </div>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{employer.calificaciones?.toFixed(1) || 0}</span>
                  <span className="text-muted-foreground">({employer.reseñas || 0} reseñas)</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" /> {employer.zona}
              </div>
              {employer.direccion && (
                <div className="text-sm text-muted-foreground">
                  <strong>Dirección:</strong> {employer.direccion}
                </div>
              )}
            </CardContent>
          </Card>

          {/* --- Información adicional --- */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Biografía</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{employer.biografia || "Este empleador aún no ha agregado una biografía."}</p>
              </CardContent>
            </Card>

            {employer.metodoPago && (
              <Card>
                <CardHeader>
                  <CardTitle>Método de Pago Preferido</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline">{employer.metodoPago}</Badge>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <strong>Correo:</strong> {employer.correo}
                </div>
                {employer.rut && (
                  <div>
                    <strong>RUT:</strong> {employer.rut}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* --- Reseñas --- */}
            <Card>
              <CardHeader>
                <CardTitle>Reseñas</CardTitle>
                <CardDescription>
                  {employer.reseñas || 0} reseña{(employer.reseñas || 0) !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((r, i) => (
                      <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, idx) => (
                              <Star
                                key={idx}
                                className={`h-4 w-4 ${
                                  idx < r.estrellas
                                    ? "text-yellow-500 fill-current"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-medium text-sm">{r.estrellas}/5</span>
                        </div>
                        <p className="text-sm mb-2">{r.comentario}</p>
                        <p className="text-xs text-muted-foreground">
                          {r.fecha?.seconds
                            ? new Date(r.fecha.seconds * 1000).toLocaleDateString('es-CL', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })
                            : r.fecha
                            ? new Date(r.fecha).toLocaleDateString('es-CL', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })
                            : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Sin reseñas aún.</p>
                )}

                {/* Formulario de reseña */}
                <div className="mt-6 pt-6 border-t">
                  <ReviewForm employerId={id || ""} onNewReview={fetchReviews} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

const EmployerPublicProfileView = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <EmployerPublicProfile />
      </main>
      <Footer />
    </div>
  );
};

export default EmployerPublicProfileView;

