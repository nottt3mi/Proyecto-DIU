import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const LoginWorker = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    correo: "",
    contraseña: ""
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

    if (!formData.correo || !formData.contraseña) {
      toast({ title: "Error", description: "Por favor completa todos los campos", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      toast({ title: "Error", description: "Por favor ingresa un email válido", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    try {
      // Login con Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, formData.correo, formData.contraseña);
      const uid = userCredential.user.uid;

      // Obtener datos del usuario desde Firestore
      const userDoc = await getDoc(doc(db, "users", uid));
      if (!userDoc.exists()) {
        toast({ title: "Error", description: "No se encontró información del usuario", variant: "destructive" });
        setIsLoading(false);
        return;
      }

      const userData = userDoc.data();
      if (userData.tipo !== "trabajador") {
        toast({ title: "Error", description: "Esta cuenta no es de tipo trabajador", variant: "destructive" });
        setIsLoading(false);
        return;
      }

      toast({ title: "¡Bienvenido!", description: "Has iniciado sesión correctamente" });
      navigate("/"); // Redirigir a home o dashboard
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.code === "auth/wrong-password" || error.code === "auth/user-not-found"
          ? "Correo o contraseña incorrectos"
          : "Hubo un problema al iniciar sesión",
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
          <Link to="/login" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a selección
          </Link>
          <div className="text-center">
            <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
              <User className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Iniciar Sesión - Trabajador</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ingresa tus credenciales para acceder a tu cuenta
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Acceso de Trabajador</CardTitle>
              <CardDescription>Ingresa tu correo y contraseña para continuar</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="correo">Correo Electrónico</Label>
                  <Input
                    id="correo"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.correo}
                    onChange={(e) => handleInputChange("correo", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contraseña">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="contraseña"
                      type={showPassword ? "text" : "password"}
                      placeholder="Tu contraseña"
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
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="text-center mt-6 space-y-2">
            <p className="text-sm text-muted-foreground">
              ¿No tienes una cuenta?{" "}
              <Link to="/register" className="text-primary hover:underline">Regístrate aquí</Link>
            </p>
            <p className="text-sm text-muted-foreground">
              ¿Olvidaste tu contraseña?{" "}
              <Link to="/forgot-password" className="text-primary hover:underline">Recupérala aquí</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginWorker;
