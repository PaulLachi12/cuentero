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
  const styles = crearEstilos(oscuro);

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
    const nuevoFav = item.favorito ? 0 : 1;
    await db.runAsync('UPDATE cuento SET favorito = ? WHERE id = ?', [nuevoFav, item.id]);
    setCuentos((prev) =>
      prev.map((c) => (c.id === item.id ? { ...c, favorito: nuevoFav } : c))
    );
  }

  return (
    <View style={styles.contenedor}>
      <Stack.Screen
        options={{
          title: `Cuentero (${cuentos.length})`,
          headerRight: () => (
            <Pressable onPress={() => router.push('/ajustes')}>
              <Text style={{ color: '#fff', fontSize: 16 }}>Ajustes</Text>
            </Pressable>
          ),
        }}
      />

      <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
        <TextInput
          style={styles.busqueda}
          placeholder="Buscar por título..."
          placeholderTextColor={oscuro ? '#888' : '#7a8b7f'}
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, maxHeight: 44, marginVertical: 8 }}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8, alignItems: 'center' }}
      >
        <Pressable
          style={[styles.chip, filtro === 0 && styles.chipActivo]}
          onPress={() => setFiltro(0)}
        >
          <Text style={[styles.chipTexto, filtro === 0 && styles.chipTextoActivo]}>todos</Text>
        </Pressable>
        {etiquetas.map((e) => {
          const activo = filtro === e.id;
          return (
            <Pressable
              key={e.id}
              style={[styles.chip, activo && styles.chipActivo]}
              onPress={() => setFiltro(activo ? 0 : e.id)}
            >
              <Text style={[styles.chipTexto, activo && styles.chipTextoActivo]}>{e.nombre}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <FlatList
        data={cuentos}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={
          <Text style={styles.vacio}>
            {busqueda || filtro
              ? 'No hay cuentos que coincidan.'
              : 'Todavía no hay cuentos. Toca + para escribir el primero.'}
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable style={styles.tarjeta} onPress={() => router.push(`/cuento/${item.id}`)}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.tarjetaTitulo}>{item.titulo}</Text>
              <Pressable onPress={() => alternarFavorito(item)}>
                <Text style={{ fontSize: 18, color: item.favorito ? '#f1c40f' : '#7a8b7f' }}>
                  {item.favorito ? '★' : '☆'}
                </Text>
              </Pressable>
            </View>
            {!!item.cuerpo && (
              <Text style={styles.tarjetaCuerpo} numberOfLines={2}>
                {item.cuerpo}
              </Text>
            )}
            <Text style={styles.tarjetaFecha}>
              {new Date(item.editado).toLocaleDateString('es-PE')}
            </Text>
          </Pressable>
        )}
      />

      <Pressable style={styles.boton} onPress={() => router.push('/cuento/nuevo')}>
        <Text style={styles.botonTexto}>+</Text>
      </Pressable>
    </View>
  );
}

function crearEstilos(oscuro) {
  return StyleSheet.create({
    contenedor: { flex: 1, backgroundColor: oscuro ? '#121212' : '#f7f5f0' },
    busqueda: {
      backgroundColor: oscuro ? '#1e1e1e' : '#fff',
      borderRadius: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: oscuro ? '#333' : '#e8e2d5',
      color: oscuro ? '#fff' : '#1b4332',
    },
    chip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: oscuro ? '#1e1e1e' : '#fff',
      borderWidth: 1,
      borderColor: oscuro ? '#333' : '#e8e2d5',
    },
    chipActivo: { backgroundColor: '#1b4332', borderColor: '#1b4332' },
    chipTexto: { color: oscuro ? '#aaa' : '#7a8b7f', fontSize: 13 },
    chipTextoActivo: { color: '#fff' },
    tarjeta: {
      backgroundColor: oscuro ? '#1e1e1e' : '#fff',
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: oscuro ? '#333' : '#e8e2d5',
    },
    tarjetaTitulo: { fontSize: 16, fontWeight: '600', color: oscuro ? '#fff' : '#1b4332', flex: 1 },
    tarjetaCuerpo: { fontSize: 14, color: oscuro ? '#aaa' : '#555', marginTop: 4 },
    tarjetaFecha: { fontSize: 12, color: '#7a8b7f', marginTop: 6 },
    vacio: { textAlign: 'center', color: '#7a8b7f', marginTop: 40 },
    boton: {
      position: 'absolute',
      right: 20,
      bottom: 28,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#1b4332',
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 4,
    },
    botonTexto: { color: '#fff', fontSize: 28, lineHeight: 30 },
  });
}