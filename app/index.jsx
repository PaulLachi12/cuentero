import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';

export default function Lista() {
  const db = useSQLiteContext();
  const router = useRouter();
  const oscuro = useColorScheme() === 'dark';
  const estilos = crearEstilos(oscuro);

  const [cuentos, setCuentos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [etiquetas, setEtiquetas] = useState([]);
  const [filtro, setFiltro] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let activo = true;
      async function cargar() {
        const etq = await db.getAllAsync('SELECT id, nombre FROM etiqueta ORDER BY nombre ASC');
        if (activo) setEtiquetas(etq);

        const filas = await db.getAllAsync(
          `SELECT DISTINCT c.id, c.titulo, c.cuerpo, c.editado, c.favorito
           FROM cuento c
           LEFT JOIN cuento_etiqueta ce ON ce.cuento_id = c.id
           WHERE (? = '' OR c.titulo LIKE ?)
             AND (? = 0 OR ce.etiqueta_id = ?)
           ORDER BY c.favorito DESC, c.editado DESC`,
          [busqueda, `%${busqueda}%`, filtro, filtro]
        );
        if (activo) setCuentos(filas);
      }
      cargar();
      return () => {
        activo = false;
      };
    }, [db, busqueda, filtro])
  );

  async function alternarFavorito(item) {
    await db.runAsync('UPDATE cuento SET favorito = ? WHERE id = ?', [
      item.favorito ? 0 : 1,
      item.id,
    ]);
    setCuentos((prev) =>
      [...prev]
        .map((c) => (c.id === item.id ? { ...c, favorito: item.favorito ? 0 : 1 } : c))
        .sort((a, b) => b.favorito - a.favorito || (b.editado < a.editado ? -1 : 1))
    );
  }

  return (
    <View style={estilos.contenedor}>
      <Stack.Screen
        options={{
          title: `Cuentero (${cuentos.length})`,
          headerRight: () => (
            <Pressable onPress={() => router.push('/ajustes')}>
              <Text style={estilos.linkCabecera}>Ajustes</Text>
            </Pressable>
          ),
        }}
      />

      <View style={estilos.busquedaContenedor}>
        <TextInput
          style={estilos.busqueda}
          placeholder="Buscar por título..."
          placeholderTextColor={oscuro ? '#8a8a8a' : '#9a9a9a'}
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={estilos.chips}
      >
        {etiquetas.map((e) => {
          const activo = filtro === e.id;
          return (
            <Pressable
              key={e.id}
              style={[estilos.chip, activo && estilos.chipActivo]}
              onPress={() => setFiltro(activo ? 0 : e.id)}
            >
              <Text style={[estilos.chipTexto, activo && estilos.chipTextoActivo]}>{e.nombre}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <FlatList
        data={cuentos}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={
          <Text style={estilos.vacio}>
            {busqueda || filtro
              ? 'No hay cuentos que coincidan.'
              : 'Todavía no hay cuentos. Toca + para escribir el primero.'}
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable style={estilos.tarjeta} onPress={() => router.push(`/cuento/${item.id}`)}>
            <View style={estilos.tarjetaCabecera}>
              <Text style={estilos.tarjetaTitulo} numberOfLines={1}>
                {item.titulo}
              </Text>
              <Pressable hitSlop={10} onPress={() => alternarFavorito(item)}>
                <Text style={[estilos.estrella, item.favorito === 1 && estilos.estrellaActiva]}>
                  {item.favorito === 1 ? '★' : '☆'}
                </Text>
              </Pressable>
            </View>
            {!!item.cuerpo && (
              <Text style={estilos.vistaPrevia} numberOfLines={2}>
                {item.cuerpo}
              </Text>
            )}
            <Text style={estilos.tarjetaFecha}>
              {new Date(item.editado).toLocaleDateString('es-PE')}
            </Text>
          </Pressable>
        )}
      />

      <Pressable style={estilos.boton} onPress={() => router.push('/cuento/nuevo')}>
        <Text style={estilos.botonTexto}>+</Text>
      </Pressable>
    </View>
  );
}

function crearEstilos(oscuro) {
  const paleta = {
    fondo: oscuro ? '#121212' : '#f7f5f0',
    tarjeta: oscuro ? '#1e1e1e' : '#ffffff',
    borde: oscuro ? '#333333' : '#e8e2d5',
    titulo: oscuro ? '#d7efe3' : '#1b4332',
    suave: oscuro ? '#9aa0a0' : '#7a8b7f',
    primario: oscuro ? '#2d6a4f' : '#1b4332',
    activo: oscuro ? '#40916c' : '#1b4332',
    campo: oscuro ? '#1e1e1e' : '#ffffff',
  };
  return StyleSheet.create({
    contenedor: { flex: 1, backgroundColor: paleta.fondo },
    linkCabecera: { color: '#fff', fontSize: 16 },
    busquedaContenedor: { paddingHorizontal: 16, paddingTop: 12 },
    busqueda: {
      backgroundColor: paleta.campo,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 10,
      fontSize: 15,
      borderWidth: 1,
      borderColor: paleta.borde,
      color: paleta.titulo,
    },
    chips: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
    chip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: paleta.tarjeta,
      borderWidth: 1,
      borderColor: paleta.borde,
    },
    chipActivo: { backgroundColor: paleta.activo, borderColor: paleta.activo },
    chipTexto: { color: paleta.suave, fontSize: 13 },
    chipTextoActivo: { color: '#fff' },
    tarjeta: {
      backgroundColor: paleta.tarjeta,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: paleta.borde,
    },
    tarjetaCabecera: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    tarjetaTitulo: { fontSize: 16, fontWeight: '600', color: paleta.titulo, flex: 1 },
    estrella: { fontSize: 20, color: paleta.suave },
    estrellaActiva: { color: '#f2b01e' },
    vistaPrevia: { fontSize: 13, color: paleta.suave, marginTop: 6, lineHeight: 18 },
    tarjetaFecha: { fontSize: 12, color: paleta.suave, marginTop: 6 },
    vacio: { textAlign: 'center', color: paleta.suave, marginTop: 40 },
    boton: {
      position: 'absolute',
      right: 20,
      bottom: 28,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: paleta.primario,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 4,
    },
    botonTexto: { color: '#fff', fontSize: 28, lineHeight: 30 },
  });
}