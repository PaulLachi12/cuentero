# Cuentero

Cuentero es una aplicaci├│n local-first para escribir, organizar y exportar cuentos desde Android o iOS. La interfaz est├í en espa├▒ol y los datos se guardan en una base SQLite local: no requiere cuentas, servidor ni conexi├│n a Internet para funcionar.

## Funcionalidades

- Listar los cuentos ordenados por ├║ltima modificaci├│n.
- Crear un cuento con un t├¡tulo obligatorio y un cuerpo opcional.
- Editar cuentos existentes.
- Borrar cuentos mediante una confirmaci├│n expl├¡cita.
- Exportar todos los cuentos a un ├║nico archivo Markdown.
- Persistir los datos localmente en `cuentero.db`.

No hay b├║squeda, categor├¡as, etiquetas, adjuntos, guardado autom├ítico, importaci├│n, sincronizaci├│n ni colaboraci├│n integrada.

## Stack

- Expo SDK `57.0.x` y React Native `0.86.x`.
- Expo Router para la navegaci├│n basada en archivos.
- `expo-sqlite` para la persistencia local.
- `expo-file-system` y `expo-sharing` para la exportaci├│n.
- JavaScript/JSX; el proyecto no usa TypeScript actualmente.

## Requisitos

- Node.js `22.13.x` o posterior, seg├║n los requisitos de Expo SDK 57.
- npm.
- Un dispositivo con Expo Go, un emulador de Android o un simulador de iOS.

Para Android, el entorno de emulaci├│n necesita Android Studio, el SDK de Android 36 y JDK 17. El simulador de iOS requiere macOS y Xcode; desde Windows se puede usar un dispositivo iOS f├¡sico mediante `npm start`.

No hay variables de entorno obligatorias en el proyecto.

## Instalaci├│n y ejecuci├│n

### 1. Preparar la computadora

1. Instala Node.js `22.13.x` o posterior y npm.
2. Abre una terminal en la carpeta ra├¡z del proyecto.
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

Este proyecto usa Expo SDK 57. Para probarlo en un celular no se instala una versi├│n de producci├│n: se instala Expo Go y se escanea el c├│digo QR que muestra la computadora.

- **Android:** instala o actualiza **Expo Go** desde Google Play.
- **iPhone:** instala o actualiza **Expo Go** siguiendo la [gu├¡a oficial de Expo para dispositivos f├¡sicos](https://docs.expo.dev/get-started/set-up-your-environment/). La disponibilidad de Expo Go y sus requisitos pueden cambiar seg├║n la regi├│n y la versi├│n de iOS.
- Si Expo Go muestra un aviso de versi├│n incompatible, actual├¡zalo y vuelve a abrir la aplicaci├│n.

La cuenta y la red son cosas distintas:

- La **red** permite que el celular alcance el servidor de desarrollo de la computadora.
- La **cuenta Expo** sirve para autenticar los flujos de desarrollo que la requieran, especialmente en un iPhone f├¡sico.
- La cuenta no sincroniza los cuentos entre dispositivos.

### 3. Conectar ambos equipos a la misma red

Para usar el c├│digo QR normal:

1. Conecta la computadora y el celular al mismo Wi-Fi.
2. Usa una red privada y estable; evita Wi-Fi de invitado, redes p├║blicas y datos m├│viles.
3. Desactiva temporalmente VPN, proxy y punto de acceso incompatible en ambos equipos si siguen sin verse.
4. En Windows, permite Node.js/Expo en el firewall cuando Windows lo solicite.
5. Mant├®n abierta la terminal donde se ejecuta Expo.

La URL que aparece en la terminal empieza normalmente por `exp://` y contiene una direcci├│n local, por ejemplo `192.168.x.x`. Esa direcci├│n debe ser alcanzable desde el celular.

### 4. Iniciar Expo y abrir el proyecto

Desde la ra├¡z del proyecto ejecuta:

```bash
npm start
```

La terminal mostrar├í un c├│digo QR. En el celular:

1. Abre **Expo Go**.
2. Escanea el c├│digo QR con la c├ímara del celular o desde el lector de QR de Expo Go.
3. Espera a que cargue la pantalla **Cuentero**.

En la terminal, `a` abre Android y `i` abre iOS cuando existe un emulador o simulador compatible. Para un celular f├¡sico, usa el QR.

### 5. Probar la aplicaci├│n

1. Pulsa `+` y crea un cuento con un t├¡tulo, por ejemplo `Prueba de conexi├│n`.
2. Pulsa **Guardar** y comprueba que regrese a la lista.
3. Abre el cuento, cambia el cuerpo y guarda otra vez.
4. Comprueba que la fecha de modificaci├│n cambie.
5. En otro intento, borra un cuento y confirma que aparece la advertencia.
6. Abre **Ajustes** y pulsa **Exportar todos mis cuentos**.
7. En el men├║ compartir del celular, elige una aplicaci├│n de destino y verifica que se puede abrir `cuentos.md`.

Para recargar la aplicaci├│n despu├®s de cambiar c├│digo, guarda el archivo y pulsa `R` en la terminal de Expo. Tambi├®n puedes usar el men├║ de desarrollador de Expo Go. Los datos deben seguir en el mismo celular despu├®s de cerrar y abrir Expo Go, porque la base es local. Desinstalar la aplicaci├│n o borrar sus datos elimina la base.

### 6. Si el QR no conecta

Comprueba en este orden:

1. Confirma que ambos equipos est├®n en el mismo Wi-Fi privado.
2. Comprueba que la terminal siga abierta y que el celular no est├® usando datos m├│viles.
3. Actualiza Expo Go y reinicia `npm start`.
4. Permite Node.js/Expo en el firewall o antivirus de Windows.
5. Usa un t├║nel como alternativa:

   ```bash
   npx expo start --tunnel
   ```

   Escanea el nuevo QR. El t├║nel no necesita que ambos equipos est├®n en la misma red Wi-Fi, pero ambos necesitan Internet. Es m├ís lento y la URL es p├║blica; ├║salo solo mientras pruebas y no la compartas. Si Expo CLI indica que falta el soporte de t├║nel, instala `@expo/ngrok` con `npm install -g @expo/ngrok`.

### Cuenta Expo para un iPhone f├¡sico

En un iPhone f├¡sico, Expo Go y Expo CLI deben iniciar sesi├│n con la misma cuenta Expo:

1. Crea una cuenta gratuita en [expo.dev/signup](https://expo.dev/signup) si todav├¡a no tienes una.
2. En la computadora, ejecuta:

   ```bash
   npx expo login
   ```

3. En el iPhone, abre Expo Go, pulsa el icono de cuenta en la esquina superior derecha e inicia sesi├│n con la misma cuenta.
4. Comprueba la cuenta de la computadora con:

   ```bash
   npx expo whoami
   ```

5. Pulsa **Try Again** en Expo Go. Si cambiaste de cuenta, reinicia `npm start`.

No escribas tu correo, contrase├▒a, token ni credenciales en este README, en el c├│digo o en un archivo versionado. Cada persona debe usar su propia cuenta. En Android, emuladores y simuladores de iOS no se aplica la comprobaci├│n de misma cuenta que Expo Go realiza en un iPhone f├¡sico.

### Probar en varios celulares

Cada celular escanea el QR por separado. Para varios iPhones f├¡sicos, la cuenta de Expo Go de cada uno debe coincidir con la cuenta que usa la computadora en Expo CLI. Los cuentos no se comparten: cada instalaci├│n tiene su propia base SQLite.

### Otros comandos

```bash
npm run android
npm run ios
npm run web
```

- `npm run android`: inicia Expo y abre el emulador/dispositivo Android disponible.
- `npm run ios`: inicia Expo y abre iOS; el simulador requiere macOS y Xcode.
- `npm run web`: el script existe, pero el soporte web est├í incompleto actualmente. Falta `react-native-web` y la configuraci├│n de Metro/WASM y encabezados que requiere `expo-sqlite` en web.

## Uso

1. Pulsa `+` en la pantalla principal para crear un cuento.
2. Escribe un t├¡tulo. El cuerpo puede quedar vac├¡o.
3. Pulsa **Guardar**.
4. Selecciona un cuento de la lista para editarlo.
5. En un cuento existente, pulsa **Borrar cuento** si quieres eliminarlo.
6. Abre **Ajustes** y pulsa **Exportar todos mis cuentos** para compartir un archivo Markdown.

El t├¡tulo se limpia antes de guardarse y no puede estar vac├¡o. Las operaciones de escritura utilizan par├ímetros SQL vinculados.

## Tareas para los alumnos

Las tareas est├ín en tres niveles. El nivel 1 es obligatorio para todos; el nivel 2 se elige; el nivel 3 es para quien quiera destacar.

### Nivel 1 ÔÇö Obligatorio (todos)

Cada tarea de este nivel se resuelve con lo ense├▒ado en la gu├¡a. Sin ayuda externa deber├¡a tomar entre 30 y 60 minutos cada una.

- [ ] **T1. Contador de cuentos.** Mostrar en la cabecera de la lista cu├íntos cuentos hay guardados. Pista: `cuentos.length`.
- [ ] **T2. Contador de palabras.** En el editor, mostrar debajo del cuerpo cu├íntas palabras lleva escritas el cuento, actualiz├índose mientras se escribe.
- [ ] **T3. Vista previa en la tarjeta.** Que cada tarjeta de la lista muestre las primeras 80 letras del cuerpo del cuento debajo del t├¡tulo. Pista: `numberOfLines={2}` en `<Text>`.
- [ ] **T4. Confirmar salida sin guardar.** Si el usuario modific├│ el texto y toca atr├ís, preguntarle si desea descartar los cambios.
- [ ] **T5. Tres cuentos propios.** Escribir tres cuentos reales de la selva dentro de la app ÔÇörecopilados de familiares, vecinos o de la tradici├│n del lugar de origen del estudianteÔÇö y exportarlos.

### Nivel 2 ÔÇö Elegir dos

Requieren investigar en la documentaci├│n de Expo. Ese es exactamente el objetivo: que el estudiante aprenda a leer documentaci├│n oficial.

- [ ] **T6. Buscador.** Un `TextInput` arriba de la lista que filtre por t├¡tulo. Debe filtrarse en SQL, no en JavaScript. Pista: `WHERE titulo LIKE ?` con `%texto%`.
- [ ] **T7. Marcar favoritos.** Agregar una columna `favorito INTEGER DEFAULT 0`, un bot├│n de estrella en cada tarjeta y que los favoritos aparezcan primero.
- [ ] **T8. Etiquetas de seres m├¡ticos.** Nueva tabla `etiqueta` y tabla puente `cuento_etiqueta`. Permitir asignar etiquetas (`chullachaqui`, `yacuruna`, `sachamama`, `tunchi`, `bufeo colorado`) y filtrar la lista por etiqueta.
- [ ] **T9. Modo oscuro.** Detectar el tema del sistema con `useColorScheme()` y adaptar todos los colores de la app.
- [ ] **T10. Autoguardado.** Que el cuento se guarde solo cada 3 segundos de inactividad, sin tocar el bot├│n. Pista: `setTimeout` dentro de un `useEffect` con limpieza.

### Nivel 3 ÔÇö Reto abierto (opcional, puntaje extra)

- [ ] **T11. Audio de la versi├│n oral.** Grabar audio con `expo-av`, guardar la ruta del archivo en la tabla `cuento` y poder reproducirlo desde el editor. Es la funcionalidad que m├ís valor cultural le da a la app.
- [ ] **T12. Lugar del cuento.** Tabla `lugar` (comunidad, r├¡o, quebrada) relacionada con `cuento`, y una pantalla que agrupe los cuentos por lugar de origen.
- [ ] **T13. Importar desde archivo.** Leer un archivo Markdown exportado previamente y volver a cargarlo en la base. Cierra el ciclo del respaldo.
- [ ] **T14. Publicar la app.** Generar un APK instalable con `eas build -p android --profile preview` y compartirlo con un compa├▒ero para que lo instale en su celular.

### Reglas de entrega

1. El trabajo es individual. Se puede consultar entre compa├▒eros, pero el c├│digo se escribe solo.
2. Est├í permitido usar IA para consultar dudas, no para generar el trabajo completo. En la sustentaci├│n se preguntar├í por cualquier l├¡nea del c├│digo: quien no pueda explicar lo que entreg├│, no aprueba.
3. Cada tarea entregada debe incluir una captura de pantalla de la funcionalidad corriendo en un celular real.

## Evaluaci├│n y entrega

### R├║brica (escala vigesimal)

| Criterio | Qu├® se eval├║a | Puntos |
| --- | --- | ---: |
| App base funcionando | Los seis pasos completos, corriendo en celular real | 6 |
| Tareas de nivel 1 | Las cinco tareas obligatorias resueltas | 5 |
| Tareas de nivel 2 | Dos tareas a elecci├│n, correctas y funcionales | 4 |
| Calidad del c├│digo | Nombres claros, sin c├│digo muerto, estilos ordenados, SQL parametrizado | 2 |
| Sustentaci├│n | Explica su c├│digo y responde preguntas sobre cualquier l├¡nea | 3 |
| Nivel 3 | Reto abierto resuelto | +2 extra |

**Nota m├íxima sin puntaje extra: 20.** El puntaje extra no compensa la ausencia de la sustentaci├│n.

### Escala de logro

| Rango | Nivel | Descripci├│n |
| --- | --- | --- |
| 18ÔÇô20 | Destacado | App completa, c├│digo limpio, domina lo que escribi├│ |
| 14ÔÇô17 | Logrado | Funciona todo lo obligatorio, explica su c├│digo |
| 11ÔÇô13 | En proceso | App base funciona, tareas incompletas |
| 0ÔÇô10 | En inicio | La app no corre o no puede explicar el c├│digo entregado |

### Formato de entrega

1. Repositorio en GitHub, p├║blico, llamado `cuentero-<apellido>`, con un `README.md` que incluya: nombre del estudiante, qu├® tareas resolvi├│, capturas de pantalla y los pasos para ejecutar el proyecto.
2. El archivo `cuentos.md` exportado desde la app con los tres cuentos de la tarea T5.
3. Importante: el repositorio no debe incluir la carpeta `node_modules`. Verificar que el archivo `.gitignore` la contenga.
4. Enviar el enlace del repositorio por el aula virtual.

### Plazos sugeridos

| Hito | Cu├índo |
| --- | --- |
| Taller presencial (sesiones 1 y 2) | Semana 1 |
| Entrega del repositorio | Fin de la semana 2 |
| Sustentaci├│n individual | Semana 3, en clase, 5 minutos por estudiante |

## Rutas

| Ruta | Archivo | Funci├│n |
| --- | --- | --- |
| `/` | `app/index.jsx` | Biblioteca principal y acceso a ajustes/nuevo cuento. |
| `/cuento/[id]` | `app/cuento/[id].jsx` | Editor de creaci├│n o edici├│n. `nuevo` activa el modo de creaci├│n. |
| `/ajustes` | `app/ajustes.jsx` | Exportaci├│n de la colecci├│n completa. |

## Arquitectura y persistencia

El layout ra├¡z (`app/_layout.jsx`) envuelve las rutas con `SQLiteProvider`. Al iniciar, la aplicaci├│n:

- abre o crea `cuentero.db`;
- activa el modo WAL de SQLite;
- crea la tabla `cuento` si no existe.

Las pantallas acceden directamente a la base mediante `useSQLiteContext()`. Actualmente no hay una capa de repositorios, servicios de API, estado global, autenticaci├│n ni componentes reutilizables separados de las rutas.

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
- `creado`: fecha de creaci├│n en formato ISO.
- `editado`: fecha de ├║ltima modificaci├│n en formato ISO.

La biblioteca muestra los cuentos ordenados por `editado DESC`. La exportaci├│n los ordena por `creado ASC`.

## Exportaci├│n

**Exportar todos mis cuentos** genera un archivo llamado `cuentos.md` dentro del directorio de documentos de la aplicaci├│n. El archivo contiene un encabezado Markdown por cuento, su fecha de creaci├│n, el cuerpo y separadores `---`.

Despu├®s de escribirlo, la aplicaci├│n abre el men├║ nativo de compartir si `expo-sharing` est├í disponible. Si no lo est├í, muestra la ruta del archivo mediante una alerta. Las exportaciones repetidas usan el mismo nombre y sobrescriben el archivo anterior.

La exportaci├│n no es una copia de la base de datos ni un mecanismo de restauraci├│n: no hay importaci├│n, backup autom├ítico ni sincronizaci├│n entre dispositivos.

## Estructura del proyecto

```text
app/
  _layout.jsx       Layout ra├¡z, navegaci├│n y proveedor SQLite
  index.jsx         Biblioteca de cuentos
  cuento/[id].jsx   Editor de creaci├│n/edici├│n
  ajustes.jsx       Exportaci├│n
assets/             Iconos y recursos visuales
app.json            Configuraci├│n de Expo
package.json        Dependencias y scripts
```

Las carpetas nativas `android/` e `ios/` no est├ín versionadas; el proyecto utiliza el flujo administrado por Expo/Continuous Native Generation.

## Estado actual y limitaciones

- No hay scripts ni configuraci├│n de `lint`, `typecheck` o pruebas automatizadas.
- No existe un sistema de migraciones versionadas para la base de datos; solo se usa `CREATE TABLE IF NOT EXISTS`.
- Las operaciones de base de datos, escritura de archivos y compartir no tienen estados de carga ni manejo completo de errores.
- El editor todav├¡a contiene un control **Listo** que referencia `keyboard` sin importarlo y usa la propiedad `textAling`; al pulsarlo puede producirse un error en `app/cuento/[id].jsx`.
- La aplicaci├│n no implementa autenticaci├│n, backend, red, cifrado SQLCipher, importaci├│n, backup, autosync ni edici├│n colaborativa.
- El objetivo web no est├í listo para producci├│n mientras falten la dependencia y la configuraci├│n web de SQLite.

## Documentaci├│n de referencia

- [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/)
- [Expo SQLite en SDK 57](https://docs.expo.dev/versions/v57.0.0/sdk/sqlite/)
- [Expo Router](https://docs.expo.dev/versions/v57.0.0/sdk/router/)
