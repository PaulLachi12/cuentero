import { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Pressable,
  Text,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useColorScheme,
  BackHandler,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';

export default function Editor() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const esNuevo = id === 'nuevo';
  const oscuro = useColorScheme() === 'dark';
  const styles = crearEstilos(oscuro);

  const [titulo, setTitulo] = useState('');
  const [cuerpo, setCuerpo] = useState('');
  const [guardado, setGuardado] = useState({ titulo: '', cuerpo: '' });
  const [etiquetas, setEtiquetas] = useState([]);
  const [etiquetasSel, setEtiquetasSel] = useState([]);
  const [autoMsg, setAutoMsg] = useState('');

  const modificado = titulo !== guardado.titulo || cuerpo !== guardado.cuerpo;

  useEffect(() => {
    async function cargar() {
      const lista = await db.getAllAsync('SELECT id, nombre FROM etiqueta ORDER BY nombre ASC');
      setEtiquetas(lista);
      if (esNuevo) return;
      const fila = await db.getFirstAsync(
        'SELECT titulo, cuerpo FROM cuento WHERE id = ?',
        [Number(id)]
      );
      if (fila) {
        setGuardado({ titulo: fila.titulo, cuerpo: fila.cuerpo });
        setTitulo(fila.titulo);
        setCuerpo(fila.cuerpo);
      }
      const rel = await db.getAllAsync(
        'SELECT etiqueta_id FROM cuento_etiqueta WHERE cuento_id = ?',
        [Number(id)]
      );
      setEtiquetasSel(rel.map((r) => r.etiqueta_id));
    }
    cargar();
  }, [id, esNuevo, db]);

  async function guardarEtiquetas(cuentoId) {
    await db.runAsync('DELETE FROM cuento_etiqueta WHERE cuento_id = ?', [cuentoId]);
    for (const e of etiquetasSel) {
      await db.runAsync('INSERT INTO cuento_etiqueta (cuento_id, etiqueta_id) VALUES (?, ?)', [
        cuentoId,
        e,
      ]);
    }
  }

  async function guardar() {
    const limpio = titulo.trim();
    if (!limpio) {
      Alert.alert('Falta el título', 'Todo cuento necesita un nombre.');
      return;
    }
    const ahora = new Date().toISOString();
    if (esNuevo) {
      const res = await db.runAsync(
        'INSERT INTO cuento (titulo, cuerpo, creado, editado) VALUES (?, ?, ?, ?)',
        [limpio, cuerpo, ahora, ahora]
      );
      await guardarEtiquetas(res.lastInsertRowId);
    } else {
      await db.runAsync(
        'UPDATE cuento SET titulo = ?, cuerpo = ?, editado = ? WHERE id = ?',
        [limpio, cuerpo, ahora, Number(id)]
      );
      await guardarEtiquetas(Number(id));
    }
    router.back();
  }

  function volver() {
    if (modificado) {
      Alert.alert('Descartar cambios', '¿Salir sin guardar?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Descartar', style: 'destructive', onPress: () => router.back() },
      ]);
    } else {
      router.back();
    }
  }

  function confirmarBorrado() {
    Alert.alert('Borrar cuento', 'Esta acción no se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Borrar',
        style: 'destructive',
        onPress: async () => {
          await db.runAsync('DELETE FROM cuento_etiqueta WHERE cuento_id = ?', [Number(id)]);
          await db.runAsync('DELETE FROM cuento WHERE id = ?', [Number(id)]);
          router.back();
        },
      },
    ]);
  }

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (modificado) {
        volver();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [modificado]);

  useEffect(() => {
    if (esNuevo || !modificado) return;
    const t = setTimeout(async () => {
      if (titulo.trim() || cuerpo) {
        await db.runAsync(
          'UPDATE cuento SET titulo = ?, cuerpo = ?, editado = ? WHERE id = ?',
          [titulo, cuerpo, new Date().toISOString(), Number(id)]
        );
        setGuardado({ titulo, cuerpo });
        setAutoMsg('Guardado automático');
        setTimeout(() => setAutoMsg(''), 2000);
      }
    }, 3000);
    return () => clearTimeout(t);
  }, [titulo, cuerpo, modificado, esNuevo, db, id]);

  const palabras = cuerpo.trim() ? cuerpo.trim().split(/\s+/).length : 0;

  function alternarEtiqueta(etiquetaId) {
    setEtiquetasSel((prev) =>
      prev.includes(etiquetaId)
        ? prev.filter((x) => x !== etiquetaId)
        : [...prev, etiquetaId]
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.contenedor}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen
        options={{
          title: esNuevo ? 'Nuevo cuento' : 'Editar cuento',
          headerLeft: () => (
            <Pressable onPress={volver}>
              <Text style={{ color: '#fff', fontSize: 16 }}>‹ Atrás</Text>
            </Pressable>
          ),
        }}
      />
      <TextInput
        style={styles.titulo}
        placeholder="Título del cuento"
        placeholderTextColor={oscuro ? '#888' : '#7a8b7f'}
        value={titulo}
        onChangeText={setTitulo}
      />
      <TextInput
        style={styles.cuerpo}
        placeholder="Había una vez, en la quebrada..."
        placeholderTextColor={oscuro ? '#888' : '#7a8b7f'}
        value={cuerpo}
        onChangeText={setCuerpo}
        multiline
        textAlignVertical="top"
      />
      <Text style={styles.contador}>{palabras} palabras</Text>
      {!!autoMsg && <Text style={styles.autoMsg}>{autoMsg}</Text>}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, maxHeight: 40 }}
        contentContainerStyle={{ gap: 8 }}
      >
        {etiquetas.map((e) => {
          const activo = etiquetasSel.includes(e.id);
          return (
            <Pressable
              key={e.id}
              style={[styles.chip, activo && styles.chipActivo]}
              onPress={() => alternarEtiqueta(e.id)}
            >
              <Text style={[styles.chipTexto, activo && styles.chipTextoActivo]}>{e.nombre}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Pressable style={styles.guardar} onPress={guardar}>
        <Text style={styles.guardarTexto}>Guardar</Text>
      </Pressable>
      {!esNuevo && (
        <Pressable onPress={confirmarBorrado}>
          <Text style={styles.borrar}>Borrar este cuento</Text>
        </Pressable>
      )}
    </KeyboardAvoidingView>
  );
}

function crearEstilos(oscuro) {
  return StyleSheet.create({
    contenedor: { flex: 1, backgroundColor: oscuro ? '#121212' : '#f7f5f0', padding: 16, gap: 12 },
    titulo: {
      fontSize: 18,
      fontWeight: '600',
      backgroundColor: oscuro ? '#1e1e1e' : '#fff',
      borderRadius: 10,
      padding: 12,
      borderWidth: 1,
      borderColor: oscuro ? '#333' : '#e8e2d5',
      color: oscuro ? '#fff' : '#1b4332',
    },
    cuerpo: {
      flex: 1,
      fontSize: 15,
      lineHeight: 22,
      backgroundColor: oscuro ? '#1e1e1e' : '#fff',
      borderRadius: 10,
      padding: 12,
      borderWidth: 1,
      borderColor: oscuro ? '#333' : '#e8e2d5',
      color: oscuro ? '#fff' : '#333',
    },
    contador: { textAlign: 'right', fontSize: 12, color: '#7a8b7f' },
    autoMsg: { textAlign: 'right', fontSize: 12, color: '#40916c' },
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
    guardar: {
      backgroundColor: '#1b4332',
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: 'center',
    },
    guardarTexto: { color: '#fff', fontWeight: '600' },
    borrar: { textAlign: 'center', color: '#a4161a', paddingVertical: 10 },
  });
}