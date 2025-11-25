# Guía Paso a Paso: Obtener Datos de Firebase Console

## 📋 Checklist - Qué necesitas copiar:

- [ ] 2-3 documentos de la colección `workers` (con ID y contenido JSON)
- [ ] Documento "Servicios Premium" de la colección `services` (con ID y contenido JSON)
- [ ] 1-2 documentos más de la colección `services`
- [ ] Reglas de seguridad completas de Firestore
- [ ] Respuestas sobre cómo funciona la app de escritorio

---

## 🔍 PASO 1: Obtener Documentos de `workers`

### Instrucciones:

1. **Abre Firebase Console:**
   - Ve a: https://console.firebase.google.com/
   - Selecciona tu proyecto: `versatilsalon-app`

2. **Accede a Firestore:**
   - En el menú izquierdo, busca **"Build"**
   - Haz clic en **"Firestore Database"**

3. **Abre la colección `workers`:**
   - Haz clic en la colección **`workers`**
   - Verás una lista de documentos

4. **Copia el primer documento:**
   - Haz clic en un documento (cualquiera)
   - **Copia el ID del documento** (está arriba, al lado del nombre de la colección)
   - **Copia todos los campos y valores** que ves
   - Si hay un botón "Ver JSON" o similar, úsalo
   - Si no, copia manualmente todos los campos

5. **Repite para 2-3 documentos más:**
   - Abre otros documentos
   - Copia ID y contenido de cada uno

### Formato para copiar:

```
ID: [pega aquí el ID del documento]
{
  "name": "[valor]",
  "services": [valores si existe],
  [otros campos]
}
```

---

## 🔍 PASO 2: Obtener Documentos de `services` (ESPECIALMENTE "Servicios Premium")

### Instrucciones:

1. **En la misma consola de Firebase:**
   - Ve a la colección **`services`**
   - Haz clic en ella

2. **Busca "Servicios Premium":**
   - Busca el documento que tenga el nombre "Servicios Premium"
   - **IMPORTANTE:** El ID del documento puede ser:
     - `premium`
     - `servicios-premium`
     - O cualquier otro ID que le hayas dado
   - **Copia el ID exacto** (esto es crucial)

3. **Copia el contenido:**
   - Haz clic en el documento "Servicios Premium"
   - Copia el ID del documento
   - Copia todos los campos (name, duration, price, isActive, etc.)

4. **Copia 1-2 servicios más:**
   - Abre otros servicios
   - Copia ID y contenido

### Formato para copiar:

```
ID: [pega aquí el ID - MUY IMPORTANTE para "Servicios Premium"]
{
  "name": "[valor]",
  "duration": [valor si existe],
  "price": [valor si existe],
  "isActive": [valor si existe],
  [otros campos]
}
```

---

## 🔍 PASO 3: Obtener Reglas de Seguridad

### Instrucciones:

1. **En Firestore Database:**
   - En la parte superior, verás pestañas
   - Haz clic en la pestaña **"Rules"** (o "Reglas")

2. **Copia todo:**
   - Verás un editor de código con las reglas
   - **Selecciona TODO** (Ctrl+A o Cmd+A)
   - **Copia** (Ctrl+C o Cmd+C)

3. **Pega en el archivo:**
   - Pega todo el contenido en la sección correspondiente

---

## 🔍 PASO 4: Responder sobre la App de Escritorio

### Preguntas (responde con lo que sepas):

1. **¿La app de escritorio actualiza Firebase cuando asignas un servicio a un trabajador?**
   - [ ] Sí
   - [ ] No
   - [ ] No estoy seguro

2. **Si sí, ¿qué campo actualiza?**
   - [ ] `services`
   - [ ] `serviceIds`
   - [ ] Otro: _______________

3. **Si no, ¿dónde guarda esta información?**
   - [ ] Base de datos local
   - [ ] Otra colección de Firebase
   - [ ] No lo sé

4. **¿Cuántos trabajadores tienen "Servicios Premium" según la app?**
   - Respuesta: **2 trabajadores** (ya lo mencionaste)

5. **¿Qué formato usa la app para identificar servicios?**
   - [ ] ID del documento
   - [ ] Nombre del servicio
   - [ ] Ambos
   - [ ] No lo sé

---

## ✅ Una vez que tengas todo:

1. Abre `RESPUESTA_COMPLETA_GEMINI.txt`
2. Completa todas las secciones `[COMPLETAR AQUÍ]`
3. Copia todo el contenido
4. Pégalo en Gemini

---

## 💡 Consejos:

- **Para copiar JSON fácilmente:** Si ves un botón "Ver JSON" o similar, úsalo
- **Si no hay botón:** Copia manualmente todos los campos que ves
- **Para el ID:** Está en la parte superior del documento, al lado del nombre de la colección
- **No te preocupes por el formato perfecto:** Gemini puede entender aunque no sea JSON perfecto

---

## 🆘 Si tienes problemas:

- **No encuentro "Servicios Premium":** Busca por el nombre en el campo `name` de los documentos
- **No veo el campo `services` en workers:** Eso es parte del problema, simplemente copia lo que veas
- **Las reglas están vacías:** Copia lo que veas, aunque sea solo comentarios

