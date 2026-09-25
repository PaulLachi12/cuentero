import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { Suspense } from 'react';
import { ActivityIndicator, View, useColorScheme } from 'react-native';
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
}

export default function Layout() {
  const esquema = useColorScheme();
  const oscuro = esquema === 'dark';
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
            headerStyle: { backgroundColor: oscuro ? '#143523' : '#1b4332' },
            headerTintColor: '#fff',
          }}
        />
      </SQLiteProvider>
    </Suspense>
  );
}