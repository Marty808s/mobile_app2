import * as SQLite from 'expo-sqlite';
import { getDetails } from '../api/fetchAPI';

// získání připojení
async function getDb() {
  return await SQLite.openDatabaseAsync('pokemon_app');
}

export async function initDB() {
  let db;
  try {
    db = await getDb();

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS pokemon(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        url TEXT
        );
        CREATE TABLE IF NOT EXISTS details(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fk_pokemon INTEGER REFERENCES pokemon(id),
        abilities TEXT,
        forms TEXT,
        moves TEXT,
        date DATETIME
        );
        CREATE UNIQUE INDEX IF NOT EXISTS idx_pokemon_url_unique
        ON pokemon(name, url);

        CREATE UNIQUE INDEX IF NOT EXISTS idx_details_fk_unique
        ON details(fk_pokemon);
    `);

    console.log("Database initialized successfully!");
  } catch (e) {
    console.error('initDB error:', e);
    throw e;
  } finally {
    try { if (db) await db.closeAsync(); } catch {}
  }
}

let isResetting = false; //lock pro zapnutí resetu
export async function resetDB() {
  if (isResetting) {
    console.warn("resetDB už běží – přeskočeno");
    return;
  }
  isResetting = true;

  try {
    // zavřít spojení, které umíme zavřít tady
    let db;
    try {
      db = await getDb();
      await db.closeAsync();
    } catch {}

    // krátká prodleva 
    await new Promise(r => setTimeout(r, 50));

    // zkusit fyzicky smazat soubor DB
    try {
      await SQLite.deleteDatabaseAsync("pokemon_app");
      console.log("DB pokemon_app smazána");
    } catch (e) {
      console.warn("deleteDatabaseAsync selhalo, padám na DROP TABLE…", e);

      // fallback: dropni tabulky a indexy
      let db2;
      try {
        db2 = await getDb();
        await db2.execAsync(`
          DROP INDEX IF EXISTS idx_pokemon_url_unique;
          DROP TABLE IF EXISTS details;
          DROP TABLE IF EXISTS pokemon;
        `);
        console.log("Tabulky a indexy smazány (fallback).");
      } finally {
        try { if (db2) await db2.closeAsync(); } catch {}
      }
    }

    // založit DB znovu
    await initDB();

  } catch (e) {
    console.error("Nepodařilo se resetovat DB:", e);
  } finally {
    isResetting = false;
  }
}

export async function insertPokemons(data) {
  if (!data || !Array.isArray(data.results)) {
    throw new Error("insertPokemons: 'data.results' musí být pole.");
  }

  let db;
  let inserted = 0;

  try {
    db = await getDb();

    const stmt = await db.prepareAsync(
      'INSERT OR IGNORE INTO pokemon(name, url) VALUES (?, ?)'
    );

    try {
      for (const item of data.results) {
        if (!item || typeof item.name !== 'string' || typeof item.url !== 'string') {
          throw new Error(`Neplatná položka: ${JSON.stringify(item)}`);
        }

        const res = await stmt.executeAsync([item.name, item.url]);
        
        const affected = (res?.changes ?? res?.rowsAffected ?? 0);
        if (affected > 0) inserted += affected;

      }
        console.log(`Hotovo. Vloženo ${inserted} nových záznamů.`);
    } finally {
      await stmt.finalizeAsync();
    }

  } finally {
    try { if (db) await db.closeAsync(); } catch {}
  }
}


export async function selectPokemonsAll() {
  let db;
  try {
    db = await getDb();
    const rows = await db.getAllAsync('SELECT * FROM pokemon');
    console.log(`Nalezeno ${rows.length} pokemonů`);
    return rows;
  } catch (e) {
    console.error('selectPokemonsAll error:', e);
    return [];
  } finally {
    try { if (db) await db.closeAsync(); } catch {}
  }
}


export async function insertDetails() {
  let db;
  let inserted = 0;
  console.log("Insertuju detaily!")

  try {
    db = await getDb();

    const pokemons = await db.getAllAsync('SELECT id, url FROM pokemon');
    if (!pokemons.length) return 0;


    const stmt = await db.prepareAsync(
      'INSERT OR IGNORE INTO details(fk_pokemon, abilities, forms, moves, date) VALUES (?, ?, ?, ?, ?)'
    );

    try {
      for (const { id, url } of pokemons) {
        const d = await getDetails(url);

        const res = await stmt.executeAsync([
          id,
          JSON.stringify(d?.abilities ?? []),
          JSON.stringify(d?.forms ?? []),
          JSON.stringify(d?.moves ?? []),
          new Date().toISOString().slice(0, 10), // YYYY-MM-DD
        ]);
        
        const affected = (res?.changes ?? res?.rowsAffected ?? 0);
        if (affected) inserted += affected;
      }

    } catch (e) {
      throw e;
    } finally {
      await stmt.finalizeAsync();
    }

    console.log(`DETAILY - Hotovo. Vloženo ${inserted} nových záznamů.`);
    return inserted;
  } finally {
    try { if (db) await db.closeAsync(); } catch {}
  }
}

export async function getDetailsById(id) {
  let db;
  try {
    db = await getDb();
    const row = await db.getFirstAsync(
      `SELECT * FROM details WHERE fk_pokemon = ?`,
      [id]
    );

    if (!row) return null;

    const parseJSON = (v, fallback = []) => {
      try { return v ? JSON.parse(v) : fallback; } catch { return fallback; }
    };

    return {
      ...row,
      abilities: parseJSON(row.abilities, []),
      forms: parseJSON(row.forms, []),
      moves: parseJSON(row.moves, []),
    };
  } catch (e) {
    throw new Error(`getDetailsById failed: ${String(e)}`);
  } finally {
    try { if (db) await db.closeAsync(); } catch {}
  }
}
