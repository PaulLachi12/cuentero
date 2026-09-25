# Cuentero

Archivo personal de cuentos de la selva amazónica. Escribe, guarda, edita y borra relatos que quedan almacenados dentro del celular, sin internet y sin servidor.

## Autor
(pon aquí tu nombre/apellido)

## Tareas resueltas
- **Nivel 1 (obligatorio):** T1 contador de cuentos, T2 contador de palabras, T3 vista previa en tarjeta, T4 confirmar salida sin guardar, T5 tres cuentos propios exportados
- **Nivel 2 (dos a elección):** T6 buscador, T7 favoritos, T8 etiquetas de seres míticos, T9 modo oscuro, T10 autoguardado
- (aquí puedes marcar con ✓ las que resolviste)

## Capturas de pantalla
(agrega aquí las capturas de cada funcionalidad corriendo en tu celular)

## Tecnologías
- React Native con **Expo** (SDK 57)
- **expo-router** para la navegación (rutas por archivos)
- **expo-sqlite** para persistencia local (motor SQLite embebido)
- **expo-file-system** + **expo-sharing** para exportar a Markdown

## Estructura
```
app/
  _layout.jsx        # base SQLite + cabecera compartida
  index.jsx          # lista: buscador, etiquetas, favoritos, vista previa
  cuento/[id].jsx    # editor: crear/editar/borrar, etiquetas, autoguardado
  ajustes.jsx        # exportar cuentos a .md
constantes.js        # etiquetas predefinidas
```

## Cómo ejecutar
1. `npm install`
2. `npx expo start` (PC y celular en la misma red) o `npx expo start --tunnel`
3. Escanear el QR con **Expo Go** desde el celular

## Base de datos
`cuentero.db` (SQLite). Tablas: `cuento`, `etiqueta`, `cuento_etiqueta`.
- `cuento`: id, titulo, cuerpo, creado, editado, favorito
- `etiqueta`: id, nombre
- `cuento_etiqueta`: cuento_id, etiqueta_id (tabla puente, relación muchos-a-muchos)

## Exportación
En **Ajustes → Exportar** se genera `cuentos.md` y se abre la hoja de compartir (WhatsApp, correo, Drive).