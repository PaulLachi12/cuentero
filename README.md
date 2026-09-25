# Cuentero

Cuentero es una aplicación local-first para escribir, organizar y exportar cuentos desde Android o iOS. La interfaz está en español y los datos se guardan en una base SQLite local: no requiere cuentas, servidor ni conexión a Internet para funcionar.

## Funcionalidades

- Listar los cuentos ordenados por última modificación.
- Crear un cuento con un título obligatorio y un cuerpo opcional.
- Editar cuentos existentes.
- Borrar cuentos mediante una confirmación explícita.
- Exportar todos los cuentos a un único archivo Markdown.
- Persistir los datos localmente en `cuentero.db`.

No hay búsqueda, categorías, etiquetas, adjuntos, guardado automático, importación, sincronización ni colaboración integrada.

## Stack

- Expo SDK `57.0.x` y React Native `0.86.x`.
- Expo Router para la navegación basada en archivos.
- `expo-sqlite` para la persistencia local.
- `expo-file-system` y `expo-sharing` para la exportación.
- JavaScript/JSX; el proyecto no usa TypeScript actualmente.

## Requisitos

- Node.js `22.13.x` o posterior, según los requisitos de Expo SDK 57.
- npm.
- Un dispositivo con Expo Go, un emulador de Android o un simulador de iOS.

Para Android, el entorno de emulación necesita Android Studio, el SDK de Android 36 y JDK 17. El simulador de iOS requiere macOS y Xcode; desde Windows se puede usar un dispositivo iOS físico mediante `npm start`.

No hay variables de entorno obligatorias en el proyecto.

## Instalación y ejecución

### 1. Preparar la computadora

1. Instala Node.js `22.13.x` o posterior y npm.
2. Abre una terminal en la carpeta raíz del proyecto.
3. Comprueba las versiones si necesitas verificar el entorno:

   ```bash
   node --version
   npm --version
   ```

4. Instala exactamente las dependencias del lockfile:

   ```bash
   npm ci
   ```

### 2. Instalar Expo Go en el celular

Este proyecto usa Expo SDK 57. Para probarlo en un celular no se instala una versión de producción: se instala Expo Go y se escanea el código QR que muestra la computadora.

- **Android:** instala o actualiza **Expo Go** desde Google Play.
- **iPhone:** instala o actualiza **Expo Go** siguiendo la [guía oficial de Expo para dispositivos físicos](https://docs.expo.dev/get-started/set-up-your-environment/). La disponibilidad de Expo Go y sus requisitos pueden cambiar según la región y la versión de iOS.
- Si Expo Go muestra un aviso de versión incompatible, actualízalo y vuelve a abrir la aplicación.

La cuenta y la red son cosas distintas:

- La **red** permite que el celular alcance el servidor de desarrollo de la computadora.
- La **cuenta Expo** sirve para autenticar los flujos de desarrollo que la requieran, especialmente en un iPhone físico.
- La cuenta no sincroniza los cuentos entre dispositivos.

### 3. Conectar ambos equipos a la misma red

Para usar el código QR normal:

1. Conecta la computadora y el celular al mismo Wi-Fi.
2. Usa una red privada y estable; evita Wi-Fi de invitado, redes públicas y datos móviles.
3. Desactiva temporalmente VPN, proxy y punto de acceso incompatible en ambos equipos si siguen sin verse.
4. En Windows, permite Node.js/Expo en el firewall cuando Windows lo solicite.
5. Mantén abierta la terminal donde se ejecuta Expo.

La URL que aparece en la terminal empieza normalmente por `exp://` y contiene una dirección local, por ejemplo `192.168.x.x`. Esa dirección debe ser alcanzable desde el celular.

### 4. Iniciar Expo y abrir el proyecto

Desde la raíz del proyecto ejecuta:

```bash
npm start
```

La terminal mostrará un código QR. En el celular:

1. Abre **Expo Go**.
2. Escanea el código QR con la cámara del celular o desde el lector de QR de Expo Go.
3. Espera a que cargue la pantalla **Cuentero**.

En la terminal, `a` abre Android y `i` abre iOS cuando existe un emulador o simulador compatible. Para un celular físico, usa el QR.

### 5. Probar la aplicación

1. Pulsa `+` y crea un cuento con un título, por ejemplo `Prueba de conexión`.
2. Pulsa **Guardar** y comprueba que regrese a la lista.
3. Abre el cuento, cambia el cuerpo y guarda otra vez.
4. Comprueba que la fecha de modificación cambie.
5. En otro intento, borra un cuento y confirma que aparece la advertencia.
6. Abre **Ajustes** y pulsa **Exportar todos mis cuentos**.
7. En el menú compartir del celular, elige una aplicación de destino y verifica que se puede abrir `cuentos.md`.

Para recargar la aplicación después de cambiar código, guarda el archivo y pulsa `R` en la terminal de Expo. También puedes usar el menú de desarrollador de Expo Go. Los datos deben seguir en el mismo celular después de cerrar y abrir Expo Go, porque la base es local. Desinstalar la aplicación o borrar sus datos elimina la base.

### 6. Si el QR no conecta

Comprueba en este orden:

1. Confirma que ambos equipos estén en el mismo Wi-Fi privado.
2. Comprueba que la terminal siga abierta y que el celular no esté usando datos móviles.
3. Actualiza Expo Go y reinicia `npm start`.
4. Permite Node.js/Expo en el firewall o antivirus de Windows.
5. Usa un túnel como alternativa:

   ```bash
   npx expo start --tunnel
   ```

   Escanea el nuevo QR. El túnel no necesita que ambos equipos estén en la misma red Wi-Fi, pero ambos necesitan Internet. Es más lento y la URL es pública; úsalo solo mientras pruebas y no la compartas. Si Expo CLI indica que falta el soporte de túnel, instala `@expo/ngrok` con `npm install -g @expo/ngrok`.

### Cuenta Expo para un iPhone físico

En un iPhone físico, Expo Go y Expo CLI deben iniciar sesión con la misma cuenta Expo:

1. Crea una cuenta gratuita en [expo.dev/signup](https://expo.dev/signup) si todavía no tienes una.
2. En la computadora, ejecuta:

   ```bash
   npx expo login
   ```

3. En el iPhone, abre Expo Go, pulsa el icono de cuenta en la esquina superior derecha e inicia sesión con la misma cuenta.
4. Comprueba la cuenta de la computadora con:

   ```bash
   npx expo whoami
   ```

5. Pulsa **Try Again** en Expo Go. Si cambiaste de cuenta, reinicia `npm start`.

No escribas tu correo, contraseña, token ni credenciales en este README, en el código o en un archivo versionado. Cada persona debe usar su propia cuenta. En Android, emuladores y simuladores de iOS no se aplica la comprobación de misma cuenta que Expo Go realiza en un iPhone físico.

### Probar en varios celulares

Cada celular escanea el QR por separado. Para varios iPhones físicos, la cuenta de Expo Go de cada uno debe coincidir con la cuenta que usa la computadora en Expo CLI. Los cuentos no se comparten: cada instalación tiene su propia base SQLite.

### Otros comandos

```bash
npm run android
npm run ios
npm run web
```

- `npm run android`: inicia Expo y abre el emulador/dispositivo Android disponible.
- `npm run ios`: inicia Expo y abre iOS; el simulador requiere macOS y Xcode.
- `npm run web`: el script existe, pero el soporte web está incompleto actualmente. Falta `react-native-web` y la configuración de Metro/WASM y encabezados que requiere `expo-sqlite` en web.

## Uso

1. Pulsa `+` en la pantalla principal para crear un cuento.
2. Escribe un título. El cuerpo puede quedar vacío.
3. Pulsa **Guardar**.
4. Selecciona un cuento de la lista para editarlo.
5. En un cuento existente, pulsa **Borrar cuento** si quieres eliminarlo.
6. Abre **Ajustes** y pulsa **Exportar todos mis cuentos** para compartir un archivo Markdown.

El título se limpia antes de guardarse y no puede estar vacío. Las operaciones de escritura utilizan parámetros SQL vinculados.

## Rutas

| Ruta | Archivo | Función |
| --- | --- | --- |
| `/` | `app/index.jsx` | Biblioteca principal y acceso a ajustes/nuevo cuento. |
| `/cuento/[id]` | `app/cuento/[id].jsx` | Editor de creación o edición. `nuevo` activa el modo de creación. |
| `/ajustes` | `app/ajustes.jsx` | Exportación de la colección completa. |

## Arquitectura y persistencia

El layout raíz (`app/_layout.jsx`) envuelve las rutas con `SQLiteProvider`. Al iniciar, la aplicación:

- abre o crea `cuentero.db`;
- activa el modo WAL de SQLite;
- crea la tabla `cuento` si no existe.

Las pantallas acceden directamente a la base mediante `useSQLiteContext()`. Actualmente no hay una capa de repositorios, servicios de API, estado global, autenticación ni componentes reutilizables separados de las rutas.

### Modelo de datos

```sql
CREATE TABLE IF NOT EXISTS cuento (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo  TEXT NOT NULL,
  cuerpo  TEXT NOT NULL DEFAULT '',
  creado  TEXT NOT NULL,
  editado TEXT NOT NULL
);
```

- `id`: identificador generado por SQLite.
- `titulo`: nombre del cuento, obligatorio.
- `cuerpo`: contenido del cuento, opcional en la interfaz.
- `creado`: fecha de creación en formato ISO.
- `editado`: fecha de última modificación en formato ISO.

La biblioteca muestra los cuentos ordenados por `editado DESC`. La exportación los ordena por `creado ASC`.

## Exportación

**Exportar todos mis cuentos** genera un archivo llamado `cuentos.md` dentro del directorio de documentos de la aplicación. El archivo contiene un encabezado Markdown por cuento, su fecha de creación, el cuerpo y separadores `---`.

Después de escribirlo, la aplicación abre el menú nativo de compartir si `expo-sharing` está disponible. Si no lo está, muestra la ruta del archivo mediante una alerta. Las exportaciones repetidas usan el mismo nombre y sobrescriben el archivo anterior.

La exportación no es una copia de la base de datos ni un mecanismo de restauración: no hay importación, backup automático ni sincronización entre dispositivos.

## Estructura del proyecto

```text
app/
  _layout.jsx       Layout raíz, navegación y proveedor SQLite
  index.jsx         Biblioteca de cuentos
  cuento/[id].jsx   Editor de creación/edición
  ajustes.jsx       Exportación
assets/             Iconos y recursos visuales
app.json            Configuración de Expo
package.json        Dependencias y scripts
```

Las carpetas nativas `android/` e `ios/` no están versionadas; el proyecto utiliza el flujo administrado por Expo/Continuous Native Generation.

## Estado actual y limitaciones

- No hay scripts ni configuración de `lint`, `typecheck` o pruebas automatizadas.
- No existe un sistema de migraciones versionadas para la base de datos; solo se usa `CREATE TABLE IF NOT EXISTS`.
- Las operaciones de base de datos, escritura de archivos y compartir no tienen estados de carga ni manejo completo de errores.
- El editor todavía contiene un control **Listo** que referencia `keyboard` sin importarlo y usa la propiedad `textAling`; al pulsarlo puede producirse un error en `app/cuento/[id].jsx`.
- La aplicación no implementa autenticación, backend, red, cifrado SQLCipher, importación, backup, autosync ni edición colaborativa.
- El objetivo web no está listo para producción mientras falten la dependencia y la configuración web de SQLite.

## Documentación de referencia

- [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/)
- [Expo SQLite en SDK 57](https://docs.expo.dev/versions/v57.0.0/sdk/sqlite/)
- [Expo Router](https://docs.expo.dev/versions/v57.0.0/sdk/router/)
