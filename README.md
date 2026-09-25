# 🌿 Cuentero — Archivo Personal de Cuentos de la Selva

Aplicación *local-first* desarrollada en React Native con Expo. Permite escribir, organizar, buscar, categorizar por seres míticos y exportar cuentos y leyendas de la selva amazónica directamente desde el celular, sin requerir internet ni servidor.

---

## 🚀 Guía Rápida de Instalación y Ejecución

Si estás teniendo problemas para instalar o ejecutar la aplicación en tu máquina, sigue estos sencillos pasos:

### 1️⃣ Requisitos Previos
* Tener **Node.js** (versión 20 o 22 LTS) instalado en la computadora.
* Tener la aplicación **Expo Go** instalada en tu celular (disponible gratis en Google Play Store y App Store).

---

### 2️⃣ Pasos para Ejecutar en 3 Comandos

Abre la terminal dentro de la carpeta del proyecto (`cuentero`):

1. **Instalar dependencias:**
   ```bash
   npm install
   ```
   > ⚠️ **NOTA (Windows):** Usa siempre `npm install` (evita usar `pnpm` o `yarn` en Windows para prevenir errores de permisos de enlaces simbólicos / symlinks).

2. **Iniciar el servidor de Expo:**
   ```bash
   npm start
   ```
   *(o también `npx expo start`)*

3. **Escanear el Código QR:**
   * **Android:** Abre la app **Expo Go** y toca "Scan QR code".
   * **iPhone:** Abre la cámara nativa del iPhone y escanea el código QR para abrir en Expo Go.

---

### 🛠️ Solución Rápida a Problemas Comunes

* ❌ **¿El celular no se conecta al QR (Error de Red / Wi-Fi)?**
  Si tu computadora y celular están en redes Wi-Fi distintas o la red tiene cortafuegos (firewall de universidad/colegio), usa el **modo túnel**:
  ```bash
  npx expo start --tunnel
  ```
  *(Escanea el nuevo código QR generado y cargará a través de internet).*

* ❌ **¿El puerto 8081 está ocupado?**
  Limpia la caché de Expo ejecutando:
  ```bash
  npx expo start -c
  ```

* ❌ **¿Error de sintaxis o pantalla blanca?**
  Asegúrate de haber corrido `npm install` limpiamente y reinicia con `npx expo start -c`.

---

## 📝 Tareas Resueltas (Rúbrica Vigesimal)

### ✅ Nivel 1 — Obligatorio (100% Resuelto)
- [x] **T1. Contador de cuentos:** Muestra la cantidad total de cuentos en la cabecera `Cuentero (N)`.
- [x] **T2. Contador de palabras:** Muestra las palabras escritas en tiempo real en el editor.
- [x] **T3. Vista previa:** Muestra 2 líneas de resumen (`numberOfLines={2}`) en cada tarjeta.
- [x] **T4. Confirmar salida sin guardar:** Muestra alerta al presionar atrás si hay cambios no guardados.
- [x] **T5. Cuentos tradicionales:** Precargados 3 cuentos reales de la tradición oral de la selva (*El Chullachaqui del camino viejo, La Yacuruna del Nanay, El Tunchi que silbó tres veces*).

### ✅ Nivel 2 — Tareas de Elección (5 de 5 Resueltas)
- [x] **T6. Buscador SQL:** Campo de búsqueda por título con filtro en SQLite (`WHERE titulo LIKE ?`).
- [x] **T7. Favoritos:** Botón de estrella (`★`/`☆`) en cada tarjeta con ordenamiento prioritario.
- [x] **T8. Etiquetas de seres míticos:** Clasificación con tabla `etiqueta` y tabla puente `cuento_etiqueta` (*chullachaqui, yacuruna, sachamama, tunchi, bufeo colorado*).
- [x] **T9. Modo oscuro:** Adaptación automática del tema del sistema con `useColorScheme()`.
- [x] **T10. Autoguardado:** Guardado automático cada 3 segundos de inactividad.

---

## 📱 Capturas de Pantalla

*(Agrega aquí las capturas de pantalla de la aplicación corriendo en tu celular)*

| Lista Principal | Editor de Cuentos | Pantalla de Ajustes |
| :---: | :---: | :---: |
| *(imagen_lista.jpg)* | *(imagen_editor.jpg)* | *(imagen_ajustes.jpg)* |

---

## 🛠️ Tecnologías y Arquitectura

* **React Native con Expo (SDK 57)**
* **Expo Router:** Enrutamiento basado en archivos (`app/_layout.jsx`, `app/index.jsx`, `app/cuento/[id].jsx`, `app/ajustes.jsx`).
* **Expo SQLite:** Persistencia de datos local en `cuentero.db` en modo WAL con consultas parametrizadas.
* **Expo FileSystem & Sharing:** Exportación de la colección a formato Markdown (`cuentos.md`).

```text
cuentero/
├── app/
│   ├── _layout.jsx       # Layout raíz, navegación Stack e inicio de SQLite
│   ├── index.jsx         # Lista principal con buscador, etiquetas y favoritos
│   ├── cuento/[id].jsx   # Editor para crear, editar, borrar y autoguardar
│   └── ajustes.jsx       # Pantalla de ajustes y exportación a cuentos.md
├── constantes.js         # Etiquetas predefinidas de seres míticos
├── app.json              # Configuración de Expo
└── package.json          # Dependencias del proyecto
```

---

## 📄 Exportación de Datos
Al ingresar a **Ajustes → Exportar todos mis cuentos**, la aplicación genera el archivo `cuentos.md` en el almacenamiento local del dispositivo y abre el menú nativo para compartirlo por WhatsApp, correo o Google Drive.