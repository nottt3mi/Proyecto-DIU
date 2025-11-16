import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Star, MapPin, Save, Upload, Eye, EyeOff, Plus, X, Briefcase, Award, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { AREAS, COMUNAS, TRABAJOS_POR_AREA } from "@/lib/options";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { auth } from "@/firebase";

const WorkerProfilePage = () => {
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
    banco: user?.banco || "",
    biografia: user?.biografia || "",
    curriculum: user?.curriculum || "",
    especialidades: user?.especialidades || [],
    experiencias: user?.experiencias || [],
    certificados: user?.certificados || [],
    areaTrabajo: user?.areaTrabajo || "",
    disponibilidadHoraria: user?.disponibilidadHoraria || ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [newEspecialidad, setNewEspecialidad] = useState("");
  const [newExperiencia, setNewExperiencia] = useState("");
  const [newCertificado, setNewCertificado] = useState("");

  useEffect(() => {
  if (user) {
    setFormData({
      nombre: user.nombre,
      apellido: user.apellido,
      rut: user.rut,
      direccion: user.direccion,
      correo: user.correo,
      contraseña: "",
      zona: user.zona,
      banco: user.banco || "",
      biografia: user.biografia || "",
      curriculum: user.curriculum || "",
      especialidades: user.especialidades || [],
      experiencias: user.experiencias || [],
      certificados: user.certificados || [],
      areaTrabajo: user.areaTrabajo || "",
      disponibilidadHoraria: user.disponibilidadHoraria || ""
    });
  }
}, [user]);

  if (!user || user.tipo !== 'trabajador') {
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

  const addEspecialidad = () => {
    if (newEspecialidad.trim() && !formData.especialidades.includes(newEspecialidad.trim())) {
      setFormData(prev => ({
        ...prev,
        especialidades: [...prev.especialidades, newEspecialidad.trim()]
      }));
      setNewEspecialidad("");
    }
  };

  const removeEspecialidad = (index: number) => {
    setFormData(prev => ({
      ...prev,
      especialidades: prev.especialidades.filter((_, i) => i !== index)
    }));
  };

  const addExperiencia = () => {
    if (newExperiencia.trim() && !formData.experiencias.includes(newExperiencia.trim())) {
      setFormData(prev => ({
        ...prev,
        experiencias: [...prev.experiencias, newExperiencia.trim()]
      }));
      setNewExperiencia("");
    }
  };

  const removeExperiencia = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experiencias: prev.experiencias.filter((_, i) => i !== index)
    }));
  };

  const addCertificado = () => {
    if (newCertificado.trim() && !formData.certificados.includes(newCertificado.trim())) {
      setFormData(prev => ({
        ...prev,
        certificados: [...prev.certificados, newCertificado.trim()]
      }));
      setNewCertificado("");
    }
  };

  const removeCertificado = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certificados: prev.certificados.filter((_, i) => i !== index)
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
        banco: formData.banco,
        biografia: formData.biografia,
        curriculum: formData.curriculum,
        especialidades: formData.especialidades,
        experiencias: formData.experiencias,
        certificados: formData.certificados,
        areaTrabajo: formData.areaTrabajo,
        disponibilidadHoraria: formData.disponibilidadHoraria
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
      banco: user.banco || "",
      biografia: user.biografia || "",
      curriculum: user.curriculum || "",
      especialidades: user.especialidades || [],
      experiencias: user.experiencias || [],
      certificados: user.certificados || [],
      areaTrabajo: user.areaTrabajo || "",
      disponibilidadHoraria: user.disponibilidadHoraria || ""
    });
    setPhotoPreview(null);
    setIsEditing(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar que el usuario esté autenticado
    if (!user || !user.id) {
      toast({
        title: "Error",
        description: "Debes estar autenticado para subir una foto",
        variant: "destructive"
      });
      return;
    }

    // Verificar autenticación de Firebase Auth
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast({
        title: "Error",
        description: "Tu sesión ha expirado. Por favor inicia sesión nuevamente.",
        variant: "destructive"
      });
      return;
    }

    // Usar el UID de Firebase Auth en lugar del ID del usuario del contexto
    const firebaseUserId = currentUser.uid;
    console.log("Firebase Auth UID:", firebaseUserId);
    console.log("User ID del contexto:", user.id);

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo de imagen válido",
        variant: "destructive"
      });
      return;
    }

    // Validar tamaño (máximo 750KB para base64 en Firestore)
    if (file.size > 750 * 1024) {
      toast({
        title: "Error",
        description: "La imagen debe ser menor a 750KB para guardarla correctamente",
        variant: "destructive"
      });
      return;
    }

    setUploadingPhoto(true);

    try {
      console.log("Iniciando conversión de imagen a base64...", { 
        firebaseUserId, 
        fileName: file.name, 
        fileSize: file.size,
        fileType: file.type
      });

      // Convertir imagen a base64
      const reader = new FileReader();
      
      const base64Image = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result);
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(file);
      });

      console.log("Imagen convertida a base64, tamaño:", base64Image.length, "caracteres");
      
      // Verificar que la imagen no sea demasiado grande (Firestore tiene límite de 1MB por campo)
      // Base64 aumenta el tamaño en ~33%, así que limitamos a ~750KB original
      const maxSize = 750 * 1024; // 750KB
      if (file.size > maxSize) {
        toast({
          title: "Error",
          description: "La imagen es demasiado grande. Por favor usa una imagen menor a 750KB.",
          variant: "destructive"
        });
        setUploadingPhoto(false);
        return;
      }
      
      // Actualizar perfil del usuario con la imagen en base64
      console.log("Actualizando perfil del usuario con imagen base64...");
      await updateUser(user.id, { foto: base64Image });
      console.log("Perfil actualizado");
      
      // Actualizar vista previa
      setPhotoPreview(base64Image);
      
      toast({
        title: "¡Foto actualizada!",
        description: "Tu foto de perfil se ha actualizado correctamente",
      });
    } catch (error: any) {
      console.error("Error completo al subir la foto:", error);
      console.error("Código de error:", error?.code);
      console.error("Mensaje de error:", error?.message);
      
      let errorMessage = "Hubo un problema al subir la foto. Por favor intenta nuevamente.";
      
      // Mensajes de error más específicos
      if (error?.code === 'storage/unauthorized') {
        errorMessage = "No tienes permisos para subir archivos. Verifica las reglas de seguridad de Firebase Storage.";
      } else if (error?.code === 'storage/canceled') {
        errorMessage = "La subida fue cancelada.";
      } else if (error?.code === 'storage/unknown') {
        errorMessage = "Error desconocido. Verifica tu conexión a internet.";
      } else if (error?.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      toast({
        title: "Error al subir foto",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setUploadingPhoto(false);
      // Limpiar el input para permitir subir la misma imagen nuevamente
      event.target.value = '';
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
              <User className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Mi Perfil - Trabajador</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Gestiona tu información profesional y experiencia
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
          {/* Información del perfil */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage 
                    src={photoPreview || user.foto} 
                    alt={`${user.nombre} ${user.apellido}`} 
                  />
                  <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{user.nombre} {user.apellido}</CardTitle>
                <CardDescription>
                  <Badge variant="secondary" className="mt-2">
                    Trabajador
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
                {user.especialidades && user.especialidades.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.especialidades.length} especialidad{user.especialidades.length > 1 ? 'es' : ''}</span>
                  </div>
                )}
                {user.certificados && user.certificados.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.certificados.length} certificado{user.certificados.length > 1 ? 's' : ''}</span>
                  </div>
                )}
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)} className="w-full">
                    Editar Perfil
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Formulario de edición */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información Personal */}
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
                          <AvatarImage 
                            src={photoPreview || user.foto} 
                            alt={`${user.nombre} ${user.apellido}`} 
                          />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="photo-upload"
                            disabled={uploadingPhoto}
                          />
                          <Button 
                            variant="outline" 
                            asChild
                            disabled={uploadingPhoto}
                          >
                            <label htmlFor="photo-upload" className="cursor-pointer">
                              <Upload className="h-4 w-4 mr-2" />
                              {uploadingPhoto ? "Subiendo..." : "Cambiar Foto"}
                            </label>
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 750KB
                      </p>
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

                    {/* Banco */}
                    <div className="space-y-2">
                      <Label htmlFor="banco">Banco para Recibir Pagos</Label>
                      <Select
                        value={formData.banco}
                        onValueChange={(value) => handleInputChange("banco", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tu banco" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="banco-chile">Banco de Chile</SelectItem>
                          <SelectItem value="santander">Santander</SelectItem>
                          <SelectItem value="bci">BCI</SelectItem>
                          <SelectItem value="itau">Itaú</SelectItem>
                          <SelectItem value="scotiabank">Scotiabank</SelectItem>
                          <SelectItem value="banco-estado">Banco Estado</SelectItem>
                          <SelectItem value="security">Security</SelectItem>
                          <SelectItem value="ripley">Banco Ripley</SelectItem>
                          <SelectItem value="falabella">Banco Falabella</SelectItem>
                          <SelectItem value="cooperativo">Banco Cooperativo</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Área de trabajo */}
                    <div className="space-y-2">
                      <Label htmlFor="areaTrabajo">Área de Trabajo</Label>
                      <Select
                        value={formData.areaTrabajo}
                        onValueChange={(value) => {
                          handleInputChange("areaTrabajo", value);
                          handleInputChange("especialidades", []);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tu área" />
                        </SelectTrigger>
                        <SelectContent>
                          {AREAS.map(a => (
                            <SelectItem key={a} value={a}>{a}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Trabajos específicos por área */}
                    {formData.areaTrabajo && (
                      <div className="space-y-2">
                        <Label>Trabajos específicos</Label>
                        <div className="flex flex-wrap gap-2">
                          {(TRABAJOS_POR_AREA[formData.areaTrabajo] || []).map((t) => {
                            const selected = (formData.especialidades as string[]).includes(t);
                            return (
                              <Button
                                key={t}
                                type="button"
                                variant={selected ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                  const next = selected
                                    ? (formData.especialidades as string[]).filter(x => x !== t)
                                    : [...(formData.especialidades as string[]), t];
                                  handleInputChange("especialidades", next as any);
                                }}
                              >
                                {t}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {/* Área de trabajo */}
                    <div className="space-y-2">
                      <Label htmlFor="areaTrabajo">Área de Trabajo</Label>
                      <Select
                        value={formData.areaTrabajo}
                        onValueChange={(value) => handleInputChange("areaTrabajo", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tu área" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Jardinería">Jardinería</SelectItem>
                          <SelectItem value="Reparaciones">Reparaciones</SelectItem>
                          <SelectItem value="Limpieza">Limpieza</SelectItem>
                          <SelectItem value="Pintura">Pintura</SelectItem>
                          <SelectItem value="Mudanzas">Mudanzas</SelectItem>
                          <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Disponibilidad */}
                    <div className="space-y-2">
                      <Label htmlFor="disponibilidadHoraria">Disponibilidad Horaria</Label>
                      <Input
                        id="disponibilidadHoraria"
                        value={formData.disponibilidadHoraria}
                        onChange={(e) => handleInputChange("disponibilidadHoraria", e.target.value)}
                        placeholder="Ej: Lun-Vie 9:00 - 18:00"
                      />
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
                        <Label className="text-sm font-medium text-muted-foreground">Banco</Label>
                        <p className="text-sm">{user.banco}</p>
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

            {/* Información Profesional */}
            <Card>
              <CardHeader>
                <CardTitle>Información Profesional</CardTitle>
                <CardDescription>
                  {isEditing ? "Gestiona tu experiencia y especialidades" : "Tu información profesional"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-6">
                    {/* Curriculum */}
                    <div className="space-y-2">
                      <Label htmlFor="curriculum">Curriculum</Label>
                      <Textarea
                        id="curriculum"
                        placeholder="Describe tu experiencia profesional..."
                        value={formData.curriculum}
                        onChange={(e) => handleInputChange("curriculum", e.target.value)}
                        rows={4}
                      />
                    </div>

                    {/* Especialidades */}
                    <div className="space-y-2">
                      <Label>Especialidades</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Agregar especialidad..."
                          value={newEspecialidad}
                          onChange={(e) => setNewEspecialidad(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addEspecialidad()}
                        />
                        <Button type="button" onClick={addEspecialidad} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.especialidades.map((especialidad, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {especialidad}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => removeEspecialidad(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Experiencias */}
                    <div className="space-y-2">
                      <Label>Experiencias de Trabajo</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Agregar experiencia..."
                          value={newExperiencia}
                          onChange={(e) => setNewExperiencia(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addExperiencia()}
                        />
                        <Button type="button" onClick={addExperiencia} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2 mt-2">
                        {formData.experiencias.map((experiencia, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                            <span className="text-sm">{experiencia}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => removeExperiencia(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Certificados */}
                    <div className="space-y-2">
                      <Label>Certificados</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Agregar certificado..."
                          value={newCertificado}
                          onChange={(e) => setNewCertificado(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addCertificado()}
                        />
                        <Button type="button" onClick={addCertificado} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2 mt-2">
                        {formData.certificados.map((certificado, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                            <span className="text-sm">{certificado}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => removeCertificado(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
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
                  <div className="space-y-6">
                    {user.curriculum && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Curriculum</Label>
                        <p className="text-sm">{user.curriculum}</p>
                      </div>
                    )}
                    
                    {user.especialidades && user.especialidades.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Especialidades</Label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {user.especialidades.map((especialidad, index) => (
                            <Badge key={index} variant="secondary">{especialidad}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {user.experiencias && user.experiencias.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Experiencias</Label>
                        <div className="space-y-1 mt-1">
                          {user.experiencias.map((experiencia, index) => (
                            <p key={index} className="text-sm">• {experiencia}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {user.certificados && user.certificados.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Certificados</Label>
                        <div className="space-y-1 mt-1">
                          {user.certificados.map((certificado, index) => (
                            <p key={index} className="text-sm">• {certificado}</p>
                          ))}
                        </div>
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

const WorkerProfilePageView = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <WorkerProfilePage />
        
      </main>
      <Footer />
    </div>
  );

}

export default WorkerProfilePageView;

