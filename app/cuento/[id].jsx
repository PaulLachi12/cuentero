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
  const estilos = crearEstilos(oscuro);

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
      const resultado = await db.runAsync(
        'INSERT INTO cuento (titulo, cuerpo, creado, editado, favorito) VALUES (?, ?, ?, ?, 0)',
        [limpio, cuerpo, ahora, ahora]
      );
      await guardarEtiquetas(resultado.lastInsertRowId);
    } else {
      await db.runAsync('UPDATE cuento SET titulo = ?, cuerpo = ?, editado = ? WHERE id = ?', [
        limpio,
        cuerpo,
        ahora,
        Number(id),
      ]);
      await guardarEtiquetas(Number(id));
    }
    router.back();
  }

  function volver() {
    if (modificado) {
      Alert.alert('Descartar cambios', 'Tienes cambios sin guardar. ¿Salir sin guardar?', [
        { text: 'Seguir editando', style: 'cancel' },
        { text: 'Descartar y salir', style: 'destructive', onPress: () => router.back() },
      ]);
    } else {
      router.back();
    }
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
    if (esNuevo) return;
    if (!modificado) return;
    const temporizador = setTimeout(async () => {
      if (titulo.trim() || cuerpo) {
        await db.runAsync('UPDATE cuento SET titulo = ?, cuerpo = ?, editado = ? WHERE id = ?', [
          titulo,
          cuerpo,
          new Date().toISOString(),
          Number(id),
        ]);
        setGuardado({ titulo, cuerpo });
        setAutoMsg('Guardado automático ✓');
        setTimeout(() => setAutoMsg(''), 2000);
      }
    }, 3000);
    return () => clearTimeout(temporizador);
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
      style={estilos.contenedor}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen
        options={{
          title: esNuevo ? 'Nuevo cuento' : 'Editar cuento',
          headerLeft: () => (
            <Pressable hitSlop={8} onPress={volver}>
              <Text style={estilos.atras}>‹ Atrás</Text>
            </Pressable>
          ),
        }}
      />
      <TextInput
        style={estilos.titulo}
        placeholder="Título del cuento"
        placeholderTextColor={oscuro ? '#8a8a8a' : '#9a9a9a'}
        value={titulo}
        onChangeText={setTitulo}
      />
      <TextInput
        style={estilos.cuerpo}
        placeholder="Había una vez, en la quebrada..."
        placeholderTextColor={oscuro ? '#8a8a8a' : '#9a9a9a'}
        value={cuerpo}
        onChangeText={setCuerpo}
        multiline
        textAlignVertical="top"
      />
      <Text style={estilos.contador}>{palabras} {palabras === 1 ? 'palabra' : 'palabras'}</Text>
      <Text style={estilos.auto}>{autoMsg}</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilos.chips}>
        {etiquetas.map((e) => {
          const activo = etiquetasSel.includes(e.id);
          return (
            <Pressable
              key={e.id}
              style={[estilos.chip, activo && estilos.chipActivo]}
              onPress={() => alternarEtiqueta(e.id)}
            >
              <Text style={[estilos.chipTexto, activo && estilos.chipTextoActivo]}>{e.nombre}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Pressable style={estilos.guardar} onPress={guardar}>
        <Text style={estilos.guardarTexto}>Guardar</Text>
      </Pressable>
      {!esNuevo && (
        <Pressable onPress={volver}>
          <Text style={estilos.borrar}>Borrar y salir</Text>
        </Pressable>
      )}
    </KeyboardAvoidingView>
  );
}

function crearEstilos(oscuro) {
  const paleta = {
    fondo: oscuro ? '#121212' : '#f7f5f0',
    campo: oscuro ? '#1e1e1e' : '#ffffff',
    borde: oscuro ? '#333333' : '#e8e2d5',
    texto: oscuro ? '#d7efe3' : '#1b4332',
    suave: oscuro ? '#9aa0a0' : '#7a8b7f',
    primario: oscuro ? '#2d6a4f' : '#1b4332',
    activo: oscuro ? '#40916c' : '#1b4332',
  };
  return StyleSheet.create({
    contenedor: { flex: 1, backgroundColor: paleta.fondo, padding: 16, gap: 12 },
    atras: { color: '#fff', fontSize: 16 },
    titulo: {
      fontSize: 18,
      fontWeight: '600',
      backgroundColor: paleta.campo,
      borderRadius: 10,
      padding: 12,
      borderWidth: 1,
      borderColor: paleta.borde,
      color: paleta.texto,
    },
    cuerpo: {
      flex: 1,
      fontSize: 15,
      lineHeight: 22,
      backgroundColor: paleta.campo,
      borderRadius: 10,
      padding: 12,
      borderWidth: 1,
      borderColor: paleta.borde,
      color: paleta.texto,
    },
    contador: { textAlign: 'right', fontSize: 12, color: paleta.suave },
    auto: { textAlign: 'right', fontSize: 12, color: '#40916c' },
    chips: { gap: 8 },
    chip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: paleta.campo,
      borderWidth: 1,
      borderColor: paleta.borde,
    },
    chipActivo: { backgroundColor: paleta.activo, borderColor: paleta.activo },
    chipTexto: { color: paleta.suave, fontSize: 13 },
    chipTextoActivo: { color: '#fff' },
    guardar: {
      backgroundColor: paleta.primario,
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: 'center',
    },
    guardarTexto: { color: '#fff', fontWeight: '600' },
    borrar: { textAlign: 'center', color: '#a4161a', paddingVertical: 10 },
  });
}