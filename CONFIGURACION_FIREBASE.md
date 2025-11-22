# Configuración de Firebase para Portal Web

## Resumen

El portal web ahora está conectado con Firebase y guarda las reservas directamente en la colección `appointments`, que es la misma que usa la aplicación de escritorio VersatilSalon. Esto permite que la jefa del local vea todas las reservas en tiempo real desde su aplicación.

## Estructura de Datos

### Colección: `appointments`
Las reservas del portal web se guardan con la siguiente estructura:

```javascript
{
  clientId: string,           // ID del cliente en la colección 'clients'
  clientName: string,          // Nombre completo del cliente
  serviceIds: [string],       // Array con IDs de servicios
  serviceName: string,        // Nombre del servicio
  startTime: Timestamp,       // Fecha y hora de inicio
  endTime: Timestamp,         // Fecha y hora de fin
  status: 'pending',          // Estado: 'pending' (pendiente de confirmación)
  notes: string,              // Comentarios del cliente
  performedBy: string,        // Nombre del estilista solicitado
  price: number,              // Precio del servicio
  origin: 'web',              // Indica que viene del portal web
  createdAt: Timestamp,      // Fecha de creación
  updatedAt: Timestamp        // Fecha de última actualización
}
```

### Colección: `services`
Los servicios deben incluir información sobre qué profesionales pueden realizarlos:

```javascript
{
  name: string,               // Nombre del servicio (ej: "Corte de Cabello")
  description: string,        // Descripción del servicio
  duration: number,           // Duración en minutos
  price: number,              // Precio del servicio
  isActive: boolean,          // Si el servicio está activo
  workerIds: [string],        // Array con IDs de workers que realizan este servicio
  createdAt: Timestamp,       // Fecha de creación
  updatedAt: Timestamp        // Fecha de última actualización
}
```

**⚠️ IMPORTANTE**: El campo `workerIds` es un array que contiene los IDs de los documentos de workers que pueden realizar ese servicio. Si este campo está vacío o no existe, todos los profesionales estarán disponibles para ese servicio.

### Colección: `clients`
Si el cliente no existe, se crea automáticamente:

```javascript
{
  firstName: string,          // Nombre
  lastName: string,           // Apellido
  phone: string,              // Teléfono (usado como identificador único)
  email: string,              // Email
  notes: string,              // Notas adicionales
  createdAt: Timestamp        // Fecha de creación
}
```

### Colección: `workers`
Los profesionales/estilistas del salón:

```javascript
{
  name: string,               // Nombre del profesional
  phone: string,              // Teléfono (opcional)
  email: string,              // Email (opcional)
  isActive: boolean,          // Si el profesional está activo
  createdAt: Timestamp,       // Fecha de creación
  updatedAt: Timestamp        // Fecha de última actualización
}
```

## Configuración de Reglas de Seguridad de Firestore

Para que el portal web pueda escribir en Firebase, necesitas configurar las reglas de seguridad en la consola de Firebase. Aquí tienes un ejemplo de reglas que permiten lectura/escritura desde el portal web:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura/escritura de clientes
    match /clients/{clientId} {
      allow read, write: if true; // Ajusta según tus necesidades de seguridad
    }
    
    // Permitir lectura/escritura de servicios
    match /services/{serviceId} {
      allow read: if true;
      allow write: if false; // Solo lectura desde el portal web
    }
    
    // Permitir lectura/escritura de workers
    match /workers/{workerId} {
      allow read: if true;
      allow write: if false; // Solo lectura desde el portal web
    }
    
    // Permitir lectura/escritura de appointments
    match /appointments/{appointmentId} {
      allow read, write: if true; // Ajusta según tus necesidades de seguridad
    }
  }
}
```

**⚠️ IMPORTANTE**: Las reglas de ejemplo anteriores son muy permisivas. Para producción, deberías implementar autenticación y reglas más restrictivas.

### Pasos para configurar las reglas:

1. Ve a la [Consola de Firebase](https://console.firebase.google.com/)
2. Selecciona tu proyecto `versatilsalon-app`
3. Ve a **Firestore Database** > **Reglas**
4. Actualiza las reglas según tus necesidades de seguridad
5. Haz clic en **Publicar**

## Mapeo de Servicios

El portal web usa IDs de servicios que se mapean a nombres en Firebase:

- `corte` → `Corte de Cabello`
- `coloracion` → `Coloración`
- `peinado` → `Peinado`
- `manicure` → `Manicure`
- `tratamiento` → `Tratamiento Capilar`
- `premium` → `Servicios Premium`

Si un servicio no existe en Firebase, se usa una duración por defecto de 60 minutos y precio 0.

## Mapeo de Estilistas

El portal web usa IDs de estilistas que se mapean a nombres:

- `1` → `María González`
- `2` → `Carlos Rodríguez`
- `3` → `Ana Martínez`
- `4` → `Laura Sánchez`

**Nota**: Asegúrate de que estos nombres coincidan con los nombres de los workers en Firebase para que las reservas se asignen correctamente.

## Flujo de Reserva

1. El cliente selecciona un servicio en el paso 1
2. En el paso 2, el sistema carga los `workerIds` del servicio seleccionado desde Firebase
3. Los profesionales que NO están en `workerIds` aparecen bloqueados/deshabilitados
4. El cliente solo puede seleccionar profesionales que realizan ese servicio
5. El cliente completa el resto del formulario
6. El sistema busca o crea el cliente en Firebase (basado en el teléfono)
7. Se crea el appointment con estado `pending`
8. La jefa del local puede ver la reserva en la app de escritorio y confirmarla

## Configuración de Servicios y Profesionales

### Cómo asignar profesionales a un servicio

En Firebase, cada documento de la colección `services` debe tener un campo `workerIds` que es un array con los IDs de los profesionales que pueden realizar ese servicio:

**Ejemplo:**
```javascript
// Servicio: Corte de Cabello
{
  name: "Corte de Cabello",
  description: "Cortes modernos y clásicos",
  duration: 60,
  price: 15000,
  isActive: true,
  workerIds: ["worker123", "worker456"], // Solo estos dos profesionales pueden hacer cortes
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Comportamiento del filtrado:

- **Si `workerIds` contiene IDs**: Solo los profesionales en ese array estarán disponibles (no bloqueados)
- **Si `workerIds` está vacío `[]` o no existe**: Todos los profesionales estarán disponibles
- **Profesionales bloqueados**: Aparecen con:
  - Fondo más oscuro y con menor opacidad
  - Icono de candado en la esquina superior derecha
  - Texto "No realiza este servicio"
  - No son clickeables (cursor no permitido)
  - Efecto de escala de grises en la imagen

## Estado de las Reservas

Las reservas del portal web se crean con estado `pending` (pendiente). La jefa del local puede:
- Confirmar la reserva (cambiar estado a `confirmed`)
- Completar la reserva (cambiar estado a `completed`)
- Cancelar la reserva (cambiar estado a `cancelled`)

## Solución de Problemas

### Error: "Missing or insufficient permissions"
- Verifica que las reglas de seguridad de Firestore permitan lectura/escritura
- Asegúrate de que la configuración de Firebase esté correcta

### Las reservas no aparecen en la app de escritorio
- Verifica que la app de escritorio esté leyendo de la colección `appointments`
- Verifica que el estado de la reserva sea visible (no esté filtrado)

### El servicio no se encuentra
- Asegúrate de que los servicios en Firebase tengan los nombres exactos que se mapean en el código
- Si un servicio no existe, se usará una duración por defecto de 60 minutos

## Archivos Modificados

- `src/lib/firebase.ts` - Configuración de Firebase
- `src/app/agendar/page.tsx` - Lógica de guardado de reservas

