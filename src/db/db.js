import * as SQLite from 'expo-sqlite';
import mockedFeed from '../constants/mockedFeed';
import { fetchRSSChannel } from '../api/FetchRSS';
// https://docs.expo.dev/versions/latest/sdk/sqlite/

// zde bude práce s databází

// Funkce pro získání nového připojení (async kvůli parametrizovaným dotazům)
async function getDb() {
    return await SQLite.openDatabaseAsync('pokemon_app');
}

export async function initDB() {
    let db;
    
    try {
        db = await getDb();

        const pokemonTable = async () => {
            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS pokemon(
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    url TEXT
                );
            `);
        }

        const detailsTable = async () => {
            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS details(
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    fk_pokemon INTEGER REFERENCES pokemon(id),
                    abilities TEXT,
                    forms TEXT,
                    moves TEXT,
                    date DATETIME
                );
            `)
        }

        //vytvoření tabulek
        await pokemonTable();
        await detailsTable();
        console.log("Tables created successfully!");

        // vytvořím index - unique pro kombinaci id a url
        await db.execAsync(`
            CREATE UNIQUE INDEX IF NOT EXISTS idx_pokemon_url_unique ON pokemon(name, url);
        `);
        
        console.log("Database initialized successfully!");
        
    } catch (e) {
        console.error('initDB error:', e);
    }
}

export async function resetDB() {
    const db = await getDb();
    db.closeAsync();
    
    try {
        await SQLite.deleteDatabaseAsync('pokemon_app');
        console.log('Databáze pokemon_app smazána');
        return;
    } catch (e) {
        console.log('Nepodařilo se smazat DB soubor, padám na DROP TABLE...', e);
    }

    // fallback: drop tabulky a indexy
    await db.execAsync(`
        DROP INDEX IF EXISTS idx_pokemon_url_unique;
        DROP TABLE IF EXISTS pokemon;
        DROP TABLE IF EXISTS details;
    `);
    console.log('Tabulky a indexy smazány');
    await db.closeAsync();
}

export async function insertPokemons(data) {
  try {
    const db = await getDb();
    const stmt = await db.prepareAsync('INSERT OR IGNORE INTO pokemon (name, url) VALUES (?, ?)');
    
    let count = 0;
    for (const item of data.results) {
      await stmt.executeAsync([item.name, item.url]);
      count++;
    }
    
    console.log(`Vloženo ${count} pokemonů do databáze`);
    await stmt.finalizeAsync();
  } catch (error) {
    console.error('Chyba při vkládání pokemonů:', error);
  }
}

export async function selectPokemonsAll() {
    try {
        const db = await getDb();
        const rows = await db.getAllAsync('SELECT * FROM pokemon');
        console.log(`Načteno ${rows.length} pokemonů z databáze`);
        return rows;
    } catch (error) {
        console.error('Chyba při načítání pokemonů:', error);
        return [];
    }
}

