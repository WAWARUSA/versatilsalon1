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

1. El cliente completa el formulario en el portal web
2. El sistema busca o crea el cliente en Firebase (basado en el teléfono)
3. El sistema busca el servicio en Firebase
4. El sistema calcula la fecha/hora de inicio y fin
5. Se crea el appointment con estado `pending`
6. La jefa del local puede ver la reserva en la app de escritorio y confirmarla

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

