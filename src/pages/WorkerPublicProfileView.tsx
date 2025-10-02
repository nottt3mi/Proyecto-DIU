import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/firebase";
import { doc, getDoc, collection, addDoc, getDocs, updateDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ---- Formulario de reseña ----
const ReviewForm = ({ workerId, onNewReview }) => {
  const { user } = useAuth();
  const [estrellas, setEstrellas] = useState(5);
  const [comentario, setComentario] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Debes iniciar sesión para dejar una reseña.");

    setIsSubmitting(true);
    try {
      const reviewsRef = collection(db, "users", workerId, "reviews");

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

      await updateDoc(doc(db, "users", workerId), {
        calificaciones: promedio,
        reseñas: snap.size
      });

      setComentario("");
      setEstrellas(5);

      if (onNewReview) onNewReview();
    } catch (error) {
      console.error("Error guardando reseña:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div>
        <label className="block text-sm font-medium">Calificación (1-5)</label>
        <input
          type="number"
          min="1"
          max="5"
          value={estrellas}
          onChange={(e) => setEstrellas(Number(e.target.value))}
          className="border rounded px-2 py-1 w-20"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Comentario</label>
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          className="border rounded px-3 py-2 w-full"
          placeholder="Escribe tu reseña..."
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Enviar Reseña"}
      </Button>
    </form>
  );
};

const WorkerPublicProfile = () => {
  const { id } = useParams();
  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWorker = async () => {
    if (!id) return;
    try {
      const docSnap = await getDoc(doc(db, "users", id));
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.tipo === "trabajador") {
          setWorker(data);
        }
      }
    } catch (error) {
      console.error("Error fetching worker:", error);
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
      await fetchWorker();
      await fetchReviews();
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Trabajador no encontrado</p>
            <Button asChild className="mt-4">
              <Link to="/services">Volver a servicios</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const initials = `${worker.nombre.charAt(0)}${worker.apellido.charAt(0)}`.toUpperCase();

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link to="/services" className="inline-flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" /> Volver a servicios
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* --- Perfil principal --- */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src={worker.foto} />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <CardTitle>{worker.nombre} {worker.apellido}</CardTitle>
              <CardDescription>
                <div className="flex items-center justify-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{worker.calificaciones?.toFixed(1) || 0}</span>
                  <span className="text-muted-foreground">({worker.reseñas || 0} reseñas)</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" /> {worker.zona}
              </div>
              {worker.areaTrabajo && (
                <div>
                  <Badge variant="secondary">{worker.areaTrabajo}</Badge>
                </div>
              )}
              {worker.disponibilidadHoraria && (
                <div className="text-sm text-muted-foreground">Disponibilidad: {worker.disponibilidadHoraria}</div>
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
                <p className="text-sm">{worker.biografia || "Este trabajador aún no ha agregado una biografía."}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Especialidades</CardTitle>
              </CardHeader>
              <CardContent>
                {worker.especialidades?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {worker.especialidades.map((e, i) => (
                      <Badge key={i} variant="outline">{e}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Sin especialidades registradas.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Experiencia</CardTitle>
              </CardHeader>
              <CardContent>
                {worker.experiencias?.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {worker.experiencias.map((exp, i) => (
                      <li key={i}>{exp}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Sin experiencias registradas.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Certificados</CardTitle>
              </CardHeader>
              <CardContent>
                {worker.certificados?.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {worker.certificados.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Sin certificados registrados.</p>
                )}
              </CardContent>
            </Card>

            {/* --- Reseñas --- */}
            <Card>
              <CardHeader>
                <CardTitle>Reseñas</CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length > 0 ? (
                  reviews.map((r, i) => (
                    <div key={i} className="border-b py-2">
                      <p className="font-medium">⭐ {r.estrellas}</p>
                      <p className="text-sm">{r.comentario}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.fecha?.seconds ? new Date(r.fecha.seconds * 1000).toLocaleDateString() : ""}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Sin reseñas aún.</p>
                )}

                {/* Formulario de reseña */}
                <ReviewForm workerId={id} onNewReview={fetchReviews} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

const WorkerPublicProfileView = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <WorkerPublicProfile />
        
      </main>
      <Footer />
    </div>
  );
};

export default WorkerPublicProfileView;
