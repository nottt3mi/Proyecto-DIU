import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Building2, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { COMUNAS } from "@/lib/options";

const RegisterEmployer = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register, login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    rut: "",
    direccion: "",
    correo: "",
    contraseña: "",
    metodoPago: "",
    zona: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validación básica
    if (!formData.nombre || !formData.apellido || !formData.rut || 
        !formData.direccion || !formData.zona || !formData.correo || !formData.contraseña || 
        !formData.metodoPago) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Validación de email básica
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

    try {
      // Registrar usuario
      const newUser = register({
        tipo: "empleador",
        nombre: formData.nombre,
        apellido: formData.apellido,
        rut: formData.rut,
        direccion: formData.direccion,
        correo: formData.correo,
        contraseña: formData.contraseña,
        metodoPago: formData.metodoPago,
        zona: formData.zona
      });

      // Iniciar sesión automáticamente
      login(newUser);
      
      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta de empleador ha sido creada y has iniciado sesión",
      });
      
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al crear tu cuenta",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/register" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a selección
          </Link>
          <div className="text-center">
            <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
              <Building2 className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Registro de Empleador</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Completa tus datos para comenzar a buscar servicios profesionales
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>
                Los campos marcados con * son obligatorios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombre y Apellido */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input
                      id="nombre"
                      type="text"
                      placeholder="Tu nombre"
                      value={formData.nombre}
                      onChange={(e) => handleInputChange("nombre", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apellido">Apellido *</Label>
                    <Input
                      id="apellido"
                      type="text"
                      placeholder="Tu apellido"
                      value={formData.apellido}
                      onChange={(e) => handleInputChange("apellido", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* RUT */}
                <div className="space-y-2">
                  <Label htmlFor="rut">RUT *</Label>
                  <Input
                    id="rut"
                    type="text"
                    placeholder="12.345.678-9"
                    value={formData.rut}
                    onChange={(e) => handleInputChange("rut", e.target.value)}
                    required
                  />
                </div>

                {/* Dirección */}
                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección *</Label>
                  <Input
                    id="direccion"
                    type="text"
                    placeholder="Tu dirección completa"
                    value={formData.direccion}
                    onChange={(e) => handleInputChange("direccion", e.target.value)}
                    required
                  />
                </div>

                {/* Zona / Comuna */}
                <div className="space-y-2">
                  <Label htmlFor="zona">Comuna *</Label>
                  <Select
                    value={(formData as any).zona || ""}
                    onValueChange={(value) => handleInputChange("zona" as any, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu comuna" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMUNAS.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="correo">Correo Electrónico *</Label>
                  <Input
                    id="correo"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.correo}
                    onChange={(e) => handleInputChange("correo", e.target.value)}
                    required
                  />
                </div>

                {/* Contraseña */}
                <div className="space-y-2">
                  <Label htmlFor="contraseña">Contraseña *</Label>
                  <div className="relative">
                    <Input
                      id="contraseña"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 8 caracteres"
                      value={formData.contraseña}
                      onChange={(e) => handleInputChange("contraseña", e.target.value)}
                      required
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

                {/* Método de Pago */}
                <div className="space-y-2">
                  <Label htmlFor="metodoPago">Método de Pago Preferido *</Label>
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

                {/* Submit Button */}
                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Creando cuenta..." : "Crear Cuenta de Empleador"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterEmployer;
