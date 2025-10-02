import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, Star, MapPin, Save, Upload, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { COMUNAS } from "@/lib/options";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const EmployerProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user?.nombre || "",
    apellido: user?.apellido || "",
    rut: user?.rut || "",
    direccion: user?.direccion || "",
    correo: user?.correo || "",
    contraseña: "",
    zona: user?.zona || "",
    metodoPago: user?.metodoPago || "",
    biografia: user?.biografia || ""
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!user || user.tipo !== 'empleador') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No tienes acceso a esta página</p>
            <Button asChild className="mt-4">
              <Link to="/">Volver al inicio</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Validación básica
      if (!formData.nombre || !formData.apellido || !formData.correo) {
        toast({
          title: "Error",
          description: "Por favor completa los campos obligatorios",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Validación de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.correo)) {
        toast({
          title: "Error",
          description: "Por favor ingresa un email válido",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Preparar datos para actualizar
      const updates: any = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        rut: formData.rut,
        direccion: formData.direccion,
        correo: formData.correo,
        zona: formData.zona,
        metodoPago: formData.metodoPago,
        biografia: formData.biografia
      };

      // Solo actualizar contraseña si se proporcionó una nueva
      if (formData.contraseña) {
        updates.contraseña = formData.contraseña;
      }

      updateUser(user.id, updates);
      
      toast({
        title: "¡Perfil actualizado!",
        description: "Tus datos han sido guardados correctamente",
      });
      
      setIsEditing(false);
      setFormData(prev => ({ ...prev, contraseña: "" }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar tu perfil",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      nombre: user.nombre,
      apellido: user.apellido,
      rut: user.rut,
      direccion: user.direccion,
      correo: user.correo,
      contraseña: "",
      zona: user.zona,
      metodoPago: user.metodoPago || "",
      biografia: user.biografia || ""
    });
    setIsEditing(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Aquí iría la lógica para subir la imagen
      toast({
        title: "Próximamente",
        description: "La subida de imágenes estará disponible pronto",
      });
    }
  };

  const initials = `${user.nombre.charAt(0)}${user.apellido.charAt(0)}`.toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio
          </Link>
          <div className="text-center">
            <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
              <Building2 className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Mi Perfil - Empleador</h1>
            <p className="text text-muted-foreground max-w-2xl mx-auto">
              Gestiona tu información personal y preferencias
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto grid lg:grid-cols-3 gap-6">
          {/* Información del perfil */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={user.foto} alt={`${user.nombre} ${user.apellido}`} />
                  <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{user.nombre} {user.apellido}</CardTitle>
                <CardDescription>
                  <Badge variant="secondary" className="mt-2">
                    Empleador
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{user.calificaciones}</span>
                  <span className="text-sm text-muted-foreground">({user.reseñas} reseñas)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.zona}</span>
                </div>
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)} className="w-full">
                    Editar Perfil
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Formulario de edición */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>
                  {isEditing ? "Edita tu información personal" : "Tu información actual"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-6">
                    {/* Foto de perfil */}
                    <div className="space-y-2">
                      <Label>Foto de Perfil</Label>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={user.foto} alt={`${user.nombre} ${user.apellido}`} />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="photo-upload"
                          />
                          <Button variant="outline" asChild>
                            <label htmlFor="photo-upload" className="cursor-pointer">
                              <Upload className="h-4 w-4 mr-2" />
                              Cambiar Foto
                            </label>
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Nombre y Apellido */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre *</Label>
                        <Input
                          id="nombre"
                          value={formData.nombre}
                          onChange={(e) => handleInputChange("nombre", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="apellido">Apellido *</Label>
                        <Input
                          id="apellido"
                          value={formData.apellido}
                          onChange={(e) => handleInputChange("apellido", e.target.value)}
                        />
                      </div>
                    </div>

                    {/* RUT */}
                    <div className="space-y-2">
                      <Label htmlFor="rut">RUT</Label>
                      <Input
                        id="rut"
                        value={formData.rut}
                        onChange={(e) => handleInputChange("rut", e.target.value)}
                      />
                    </div>

                    {/* Dirección */}
                    <div className="space-y-2">
                      <Label htmlFor="direccion">Dirección</Label>
                      <Input
                        id="direccion"
                        value={formData.direccion}
                        onChange={(e) => handleInputChange("direccion", e.target.value)}
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="correo">Correo Electrónico *</Label>
                      <Input
                        id="correo"
                        type="email"
                        value={formData.correo}
                        onChange={(e) => handleInputChange("correo", e.target.value)}
                      />
                    </div>

                    {/* Contraseña */}
                    <div className="space-y-2">
                      <Label htmlFor="contraseña">Nueva Contraseña (opcional)</Label>
                      <div className="relative">
                        <Input
                          id="contraseña"
                          type={showPassword ? "text" : "password"}
                          value={formData.contraseña}
                          onChange={(e) => handleInputChange("contraseña", e.target.value)}
                          placeholder="Deja vacío para mantener la actual"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Zona */}
                    <div className="space-y-2">
                      <Label htmlFor="zona">Zona</Label>
                      <Select
                        value={formData.zona}
                        onValueChange={(value) => handleInputChange("zona", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tu comuna" />
                        </SelectTrigger>
                        <SelectContent>
                          {COMUNAS.map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Método de Pago */}
                    <div className="space-y-2">
                      <Label htmlFor="metodoPago">Método de Pago Preferido</Label>
                      <Select
                        value={formData.metodoPago}
                        onValueChange={(value) => handleInputChange("metodoPago", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tu método de pago" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="credito">Tarjeta de Crédito</SelectItem>
                          <SelectItem value="debito">Tarjeta de Débito</SelectItem>
                          <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                          <SelectItem value="efectivo">Efectivo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Biografía */}
                    <div className="space-y-2">
                      <Label htmlFor="biografia">Biografía</Label>
                      <Textarea
                        id="biografia"
                        placeholder="Cuéntanos sobre ti..."
                        value={formData.biografia}
                        onChange={(e) => handleInputChange("biografia", e.target.value)}
                        rows={4}
                      />
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-4 pt-4">
                      <Button onClick={handleSave} disabled={isLoading} className="flex-1">
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? "Guardando..." : "Guardar Cambios"}
                      </Button>
                      <Button variant="outline" onClick={handleCancel} className="flex-1">
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Nombre</Label>
                        <p className="text-sm">{user.nombre} {user.apellido}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">RUT</Label>
                        <p className="text-sm">{user.rut}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Correo</Label>
                        <p className="text-sm">{user.correo}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Zona</Label>
                        <p className="text-sm">{user.zona}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Dirección</Label>
                        <p className="text-sm">{user.direccion}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Método de Pago</Label>
                        <p className="text-sm">{user.metodoPago}</p>
                      </div>
                    </div>
                    {user.biografia && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Biografía</Label>
                        <p className="text-sm">{user.biografia}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmployerProfilePageView = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <EmployerProfilePage />
        
      </main>
      <Footer />
    </div>
  );

}

export default EmployerProfilePageView;

