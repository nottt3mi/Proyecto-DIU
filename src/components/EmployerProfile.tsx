import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, MapPin, LogOut, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const EmployerProfile = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  if (!user || user.tipo !== 'empleador') {
    return null;
  }

  const handleLogout = () => {
    logout();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
  };

  const handleEditProfile = () => {
    // Redirigir a la página de perfil completa
    window.location.href = "/profile/employer";
  };

  // Generar iniciales del nombre
  const initials = `${user.nombre.charAt(0)}${user.apellido.charAt(0)}`.toUpperCase();

  return (
    <div className="flex items-center gap-4">
      {/* Avatar y nombre */}
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.foto} alt={`${user.nombre} ${user.apellido}`} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="hidden md:block">
          <p className="font-medium text-sm">{user.nombre} {user.apellido}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {user.zona}
          </div>
        </div>
      </div>

      {/* Información del perfil */}
      <div className="hidden lg:flex items-center gap-4">
        {/* Calificaciones */}
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-500 fill-current" />
          <span className="text-sm font-medium">{user.calificaciones}</span>
          <span className="text-xs text-muted-foreground">({user.reseñas})</span>
        </div>

        {/* Badge de tipo */}
        <Badge variant="secondary" className="text-xs">
          Empleador
        </Badge>
      </div>

      {/* Botones de acción */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEditProfile}
          className="hidden md:flex"
        >
          <Edit className="h-4 w-4 mr-1" />
          Editar
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden md:inline ml-1">Cerrar Sesión</span>
        </Button>
      </div>
    </div>
  );
};

export default EmployerProfile;
