# Configuración de Servicios por Trabajador

## Resumen

El portal web ahora filtra los trabajadores (estilistas) según el servicio seleccionado. Solo se mostrarán los trabajadores que pueden realizar el servicio elegido.

## Estructura de Datos en Firebase

### Colección: `workers`

Cada trabajador debe tener un campo `services` que es un array de IDs o nombres de servicios que puede realizar.

#### Ejemplo de estructura:

```javascript
{
  name: "Juan",
  services: ["premium", "coloracion"] // Juan puede hacer Servicios Premium y Coloración
}
```

```javascript
{
  name: "María",
  services: ["corte", "peinado", "manicure"] // María puede hacer Corte, Peinado y Manicure
}
```

```javascript
{
  name: "Carlos",
  services: [] // Si no tiene servicios o el array está vacío, aparecerá para todos los servicios (retrocompatibilidad)
}
```

## IDs de Servicios Disponibles

Puedes usar cualquiera de estos formatos en el array `services`:

### Opción 1: IDs base (recomendado)
- `"corte"` → Corte de Cabello
- `"coloracion"` → Coloración
- `"peinado"` → Peinado
- `"manicure"` → Manicure
- `"tratamiento"` → Tratamiento Capilar
- `"premium"` → Servicios Premium

### Opción 2: Nombres completos
- `"Corte de Cabello"`
- `"Coloración"`
- `"Peinado"`
- `"Manicure"`
- `"Tratamiento Capilar"`
- `"Servicios Premium"`

### Opción 3: IDs de Firebase
- Puedes usar directamente el ID del documento del servicio en Firebase (ej: `"abc123xyz"`)

## Cómo Configurar en Firebase

### Paso 1: Acceder a Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Firestore Database**

### Paso 2: Editar un Trabajador
1. Ve a la colección `workers`
2. Selecciona el documento del trabajador que quieres editar
3. Agrega o edita el campo `services` como un array

### Ejemplo Práctico

**Juan hace Servicios Premium pero NO Corte de Cabello:**

```javascript
// Documento: workers/juan-id
{
  name: "Juan",
  services: ["premium", "coloracion"] // Solo estos servicios
}
```

**María hace Corte de Cabello y Peinado:**

```javascript
// Documento: workers/maria-id
{
  name: "María",
  services: ["corte", "peinado"]
}
```

## Comportamiento

- **Si un trabajador NO tiene el campo `services`** o el array está vacío: Aparecerá para TODOS los servicios (comportamiento por defecto para retrocompatibilidad)
- **Si un trabajador tiene servicios definidos**: Solo aparecerá cuando se seleccione uno de esos servicios
- **Si no hay trabajadores disponibles para un servicio**: Se mostrará el mensaje "No hay estilistas disponibles para este servicio"

## Notas Importantes

1. **Retrocompatibilidad**: Los trabajadores existentes sin el campo `services` seguirán apareciendo para todos los servicios
2. **Flexibilidad**: Puedes mezclar IDs base, nombres completos e IDs de Firebase en el mismo array
3. **Actualización en tiempo real**: Los cambios en Firebase se reflejan automáticamente en el portal

## Ejemplo Completo

```javascript
// workers/juan-perez
{
  name: "Juan Pérez",
  services: ["premium", "coloracion"]
}

// workers/maria-gonzalez
{
  name: "María González",
  services: ["corte", "peinado", "manicure"]
}

// workers/carlos-rodriguez
{
  name: "Carlos Rodríguez",
  services: [] // Aparece para todos los servicios
}
```

Con esta configuración:
- Al seleccionar "Servicios Premium": Solo aparecerá Juan Pérez
- Al seleccionar "Corte de Cabello": Aparecerán María González y Carlos Rodríguez
- Al seleccionar "Coloración": Aparecerán Juan Pérez y Carlos Rodríguez

