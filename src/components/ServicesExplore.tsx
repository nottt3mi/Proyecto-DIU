// src/pages/ServicesExplore.tsx
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star } from "lucide-react";
import { useAuth, User } from "@/contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { COMUNAS, TRABAJOS_POR_AREA } from "@/lib/options";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";

const AREAS = ["Jardinería", "Reparaciones", "Limpieza", "Pintura", "Mudanzas", "Mantenimiento"];
const ALL_VALUE = "all";

type SortBy = "calificacion" | "nombre";

const ServicesExplore = () => {
  const { user } = useAuth();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialArea = params.get("area") || ALL_VALUE;

  const [area, setArea] = useState<string>(initialArea);
  const [sortBy, setSortBy] = useState<SortBy>("calificacion");
  const [search, setSearch] = useState<string>("");
  const [comuna, setComuna] = useState<string>(ALL_VALUE);
  const [trabajo, setTrabajo] = useState<string>(ALL_VALUE);
  const [workers, setWorkers] = useState<User[]>([]);

  // Cargar trabajadores desde Firestore
  useEffect(() => {
    const fetchWorkers = async () => {
      const q = query(collection(db, "users"), where("tipo", "==", "trabajador"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => doc.data() as User);
      setWorkers(data);
    };

    fetchWorkers();
  }, []);

  const filtered = useMemo(() => {
    let list = workers;

    if (area !== ALL_VALUE) list = list.filter(w => w.areaTrabajo === area);
    if (comuna !== ALL_VALUE) list = list.filter(w => w.zona === comuna);
    if (trabajo !== ALL_VALUE) list = list.filter(w => (w.especialidades || []).includes(trabajo));
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(w =>
        `${w.nombre} ${w.apellido}`.toLowerCase().includes(q) ||
        (w.especialidades || []).some(e => e.toLowerCase().includes(q))
      );
    }

    if (sortBy === "calificacion") list = [...list].sort((a, b) => (b.calificaciones || 0) - (a.calificaciones || 0));
    if (sortBy === "nombre") list = [...list].sort((a, b) => `${a.nombre} ${a.apellido}`.localeCompare(`${b.nombre} ${b.apellido}`));

    return list;
  }, [workers, area, comuna, trabajo, search, sortBy]);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Explorar trabajadores</h1>
          <p className="text-muted-foreground">Filtra por área, comuna, ordena por calificación o nombre y busca especialidades.</p>
        </div>

        {/* Filtros */}
        <div className="grid gap-3 md:grid-cols-5 mb-8">
          <div>
            <label className="text-sm text-muted-foreground">Área de trabajo</label>
            <Select value={area} onValueChange={setArea}>
              <SelectTrigger><SelectValue placeholder="Todas las áreas" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>Todas</SelectItem>
                {AREAS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Comuna</label>
            <Select value={comuna} onValueChange={setComuna}>
              <SelectTrigger><SelectValue placeholder="Todas las comunas" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>Todas</SelectItem>
                {COMUNAS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Trabajo específico</label>
            <Select value={trabajo} onValueChange={setTrabajo}>
              <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>Todos</SelectItem>
                {(area !== ALL_VALUE ? TRABAJOS_POR_AREA[area] : Object.values(TRABAJOS_POR_AREA).flat()).map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Ordenar por</label>
            <Select value={sortBy} onValueChange={v => setSortBy(v as SortBy)}>
              <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="calificacion">Calificación</SelectItem>
                <SelectItem value="nombre">Nombre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Buscar</label>
            <Input placeholder="Nombre o especialidad" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Lista de trabajadores */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(worker => {
            const initials = `${worker.nombre.charAt(0)}${worker.apellido.charAt(0)}`.toUpperCase();
            return (
              <Card key={worker.id} className="border hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={worker.foto} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{worker.nombre} {worker.apellido}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{worker.calificaciones?.toFixed(1) || 0}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {worker.zona}
                      </div>
                      {worker.areaTrabajo && <div className="mt-1"><Badge variant="secondary">{worker.areaTrabajo}</Badge></div>}
                    </div>
                  </div>

                  {worker.disponibilidadHoraria && (
                    <p className="text-xs text-muted-foreground mt-3">Disponibilidad: {worker.disponibilidadHoraria}</p>
                  )}

                  {worker.especialidades && worker.especialidades.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {worker.especialidades.slice(0, 4).map((esp, idx) => (
                        <Badge key={idx} variant="outline">{esp}</Badge>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex justify-end">
                    <Button asChild size="sm" className="ml-5" variant="outline">
                      <Link to={`/worker/${worker.id}`}>Ver perfil</Link>
                    </Button>

                    <Button asChild size="sm" className="ml-5">
                      <Link to={`/booking/${worker.id}`}>Agendar visita</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {filtered.length === 0 && <p className="text-muted-foreground">No se encontraron trabajadores con los filtros seleccionados.</p>}
        </div>
      </div>
    </section>
  );
};

export default ServicesExplore;
