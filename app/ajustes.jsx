import { View, Text, Pressable, Alert, StyleSheet, useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function Ajustes() {
  const db = useSQLiteContext();
  const oscuro = useColorScheme() === 'dark';
  const estilos = crearEstilos(oscuro);

  async function exportar() {
    const cuentos = await db.getAllAsync(
      'SELECT titulo, cuerpo, creado FROM cuento ORDER BY creado ASC'
    );
    if (cuentos.length === 0) {
      Alert.alert('Nada que exportar', 'Todavía no has escrito ningún cuento.');
      return;
    }
    const texto = cuentos
      .map((c) => `# ${c.titulo}\n(${c.creado.slice(0, 10)})\n\n${c.cuerpo}`)
      .join('\n\n---\n\n');
    const ruta = FileSystem.documentDirectory + 'cuentos.md';
    await FileSystem.writeAsStringAsync(ruta, texto);
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(ruta);
    } else {
      Alert.alert('Guardado', `Archivo creado en: ${ruta}`);
    }
  }

  return (
    <View style={estilos.contenedor}>
      <Stack.Screen options={{ title: 'Ajustes' }} />
      <Pressable style={estilos.boton} onPress={exportar}>
        <Text style={estilos.botonTexto}>Exportar todos mis cuentos</Text>
      </Pressable>
      <Text style={estilos.nota}>
        Se genera un archivo Markdown con todos tus cuentos y se abre el menú para compartirlo.
      </Text>
    </View>
  );
}

function crearEstilos(oscuro) {
  const paleta = {
    fondo: oscuro ? '#121212' : '#f7f5f0',
    primario: oscuro ? '#2d6a4f' : '#1b4332',
    nota: oscuro ? '#9aa0a0' : '#7a8b7f',
  };
  return StyleSheet.create({
    contenedor: { flex: 1, backgroundColor: paleta.fondo, padding: 16, gap: 12 },
    boton: {
      backgroundColor: paleta.primario,
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: 'center',
    },
    botonTexto: { color: '#fff', fontWeight: '600' },
    nota: { color: paleta.nota, fontSize: 13, lineHeight: 19 },
  });
}