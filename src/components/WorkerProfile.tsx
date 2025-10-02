import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, MapPin, LogOut, Edit, Briefcase, Award, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const WorkerProfile = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  if (!user || user.tipo !== 'trabajador') {
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
    window.location.href = "/profile/worker";
  };

  // Generar iniciales del nombre
  const initials = `${user.nombre.charAt(0)}${user.apellido.charAt(0)}`.toUpperCase();

  return (
    <div className="flex items-center gap-4">
      {/* Avatar y nombre */}
      <div className="flex items-center gap-3">
      <button className="flex items-center gap-3" onClick={handleEditProfile}>
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
      </button>
      {/* Botones de acción */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
    </div>
  );
};

export default WorkerProfile;
