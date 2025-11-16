# Configuración de Reglas de Seguridad de Firebase Storage

Para que la funcionalidad de subida de fotos de perfil funcione correctamente, necesitas configurar las reglas de seguridad de Firebase Storage.

## Pasos para configurar las reglas:

1. Ve a la [Consola de Firebase](https://console.firebase.google.com/)
2. Selecciona tu proyecto: `helpers-95b5e`
3. En el menú lateral, ve a **Storage** (Almacenamiento)
4. Haz clic en la pestaña **Rules** (Reglas)
5. Reemplaza las reglas existentes con las siguientes:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permitir a usuarios autenticados subir y leer sus propias fotos de perfil
    match /profile-photos/{userId}/{allPaths=**} {
      // Solo el usuario autenticado puede leer sus propias fotos
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Solo el usuario autenticado puede subir fotos a su propia carpeta
      allow write: if request.auth != null 
                   && request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024  // Máximo 5MB
                   && request.resource.contentType.matches('image/.*');
    }
    
    // Regla por defecto: denegar todo lo demás
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

**IMPORTANTE**: Si aún tienes problemas después de configurar las reglas, puedes usar temporalmente estas reglas más permisivas para probar (NO recomendadas para producción):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Reglas temporales para desarrollo - PERMITIR TODO (NO USAR EN PRODUCCIÓN)
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Nota de seguridad**: Las reglas temporales permiten que cualquier usuario autenticado suba/lea cualquier archivo. Úsalas solo para probar que la funcionalidad básica funciona, luego vuelve a las reglas restrictivas.

6. Haz clic en **Publish** (Publicar) para guardar las reglas

## Explicación de las reglas:

- **`/profile-photos/{userId}/{allPaths=**}`**: Esta ruta coincide con todas las fotos de perfil organizadas por ID de usuario
- **`allow read`**: Los usuarios autenticados solo pueden leer sus propias fotos
- **`allow write`**: Los usuarios autenticados solo pueden subir fotos a su propia carpeta, con validaciones de:
  - Tamaño máximo: 5MB
  - Tipo de archivo: solo imágenes
- **`match /{allPaths=**}`**: Regla por defecto que deniega todo lo demás para mayor seguridad

## Nota importante:

Si las reglas no están configuradas correctamente, verás un error `storage/unauthorized` en la consola del navegador cuando intentes subir una foto.

