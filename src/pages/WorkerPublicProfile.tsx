import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Award, Briefcase, FileText, ArrowLeft } from "lucide-react";

const WorkerPublicProfile = () => {
  const { id } = useParams();
  const { users } = useAuth();

  const worker = useMemo(() => users.find(u => u.id === id && u.tipo === 'trabajador'), [users, id]);

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
                  <span className="text-muted-foreground">({worker.reseñas} reseñas)</span>
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
                {worker.especialidades && worker.especialidades.length > 0 ? (
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
                {worker.experiencias && worker.experiencias.length > 0 ? (
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
                {worker.certificados && worker.certificados.length > 0 ? (
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkerPublicProfile;
