import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { Suspense } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { ETIQUETAS_PREDEFINIDAS } from '../constantes';

async function iniciarBD(db) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS cuento (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo   TEXT NOT NULL,
      cuerpo   TEXT NOT NULL DEFAULT '',
      creado   TEXT NOT NULL,
      editado  TEXT NOT NULL,
      favorito INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS etiqueta (
      id     INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL UNIQUE
    );
    CREATE TABLE IF NOT EXISTS cuento_etiqueta (
      cuento_id   INTEGER NOT NULL,
      etiqueta_id INTEGER NOT NULL,
      PRIMARY KEY (cuento_id, etiqueta_id)
    );
    ${ETIQUETAS_PREDEFINIDAS.map((e) => `INSERT OR IGNORE INTO etiqueta (nombre) VALUES ('${e}');`).join(' ')}
  `);

  try {
    await db.execAsync('ALTER TABLE cuento ADD COLUMN favorito INTEGER NOT NULL DEFAULT 0');
  } catch (e) {}

  const res = await db.getFirstAsync('SELECT COUNT(*) as total FROM cuento');
  if (res && res.total === 0) {
    const ahora = new Date().toISOString();
    const c1 = await db.runAsync(
      'INSERT INTO cuento (titulo, cuerpo, creado, editado, favorito) VALUES (?, ?, ?, ?, 1)',
      [
        'El Chullachaqui del camino viejo',
        'En las profundidades del monte amazónico habita el Chullachaqui, duende guardián de la selva que engaña a los cazadores tomando la forma de un conocido.',
        ahora,
        ahora,
      ]
    );
    const c2 = await db.runAsync(
      'INSERT INTO cuento (titulo, cuerpo, creado, editado, favorito) VALUES (?, ?, ?, ?, 1)',
      [
        'La Yacuruna del Nanay',
        'Relato sobre el espíritu de las aguas profundas del río Nanay que atrae a los pescadores en las noches de luna.',
        ahora,
        ahora,
      ]
    );
    const c3 = await db.runAsync(
      'INSERT INTO cuento (titulo, cuerpo, creado, editado, favorito) VALUES (?, ?, ?, ?, 0)',
      [
        'El Tunchi que silbó tres veces',
        'Historia tradicional sobre el misterioso silbido del tunchi en la noche oscura de la quebrada.',
        ahora,
        ahora,
      ]
    );

    const etqs = await db.getAllAsync('SELECT id, nombre FROM etiqueta');
    const getId = (n) => etqs.find((e) => e.nombre === n)?.id;
    if (c1?.lastInsertRowId && getId('chullachaqui')) {
      await db.runAsync('INSERT OR IGNORE INTO cuento_etiqueta VALUES (?, ?)', [c1.lastInsertRowId, getId('chullachaqui')]);
    }
    if (c2?.lastInsertRowId && getId('yacuruna')) {
      await db.runAsync('INSERT OR IGNORE INTO cuento_etiqueta VALUES (?, ?)', [c2.lastInsertRowId, getId('yacuruna')]);
    }
    if (c3?.lastInsertRowId && getId('tunchi')) {
      await db.runAsync('INSERT OR IGNORE INTO cuento_etiqueta VALUES (?, ?)', [c3.lastInsertRowId, getId('tunchi')]);
    }
  }
}

export default function Layout() {
  return (
    <Suspense
      fallback={
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      }
    >
      <SQLiteProvider databaseName="cuentero.db" onInit={iniciarBD} useSuspense>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#1b4332' },
            headerTintColor: '#fff',
          }}
        />
      </SQLiteProvider>
    </Suspense>
  );
}