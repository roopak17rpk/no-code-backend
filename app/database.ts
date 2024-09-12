import mysql, { OkPacket, OkPacketParams, ResultSetHeader } from "mysql2";
import { Store } from "./api/getStoreById/storeTypes";

// Database connection configuration
const dbConfig = {
  host: process.env.NEXT_PUBLIC_MY_SQL_HOST,
  user: process.env.NEXT_PUBLIC_MY_SQL_USER,
  password: process.env.NEXT_PUBLIC_MY_SQL_PASSWORD,
  database: process.env.NEXT_PUBLIC_MY_SQL_DATABASE,
};

// Create a connection pool
const pool = mysql.createPool(dbConfig).promise();

// Function to fetch all notes
async function getAllNotes() {
  try {
    const [rows] = await pool.query("SELECT * FROM notes");
    return rows;
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
}

/**
 * Fetches a store from the database by its ID.
 * @param {number} storeId - The ID of the store to fetch.
 * @returns {Promise<Store | null>} The fetched store, or null if not found.
 * @throws {Error} If there is an error while fetching the store.
 */
async function getStoreById(storeId: number): Promise<Store | null> {
  try {
    const [rows] = await pool.query("SELECT * FROM notes WHERE id = ?", [
      storeId,
    ]);
    if (Array.isArray(rows)) {
      const store = rows[0] as Store | null;
      return store;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching store by ID:", error);
    throw error;
  }
}

// Function to initialize the database connection
async function initializeDatabase() {
  try {
    await pool.query("SELECT 1");
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
}

// Initialize the database connection
initializeDatabase();

const createStore = async (title: string, contents: string) => {
  const [result] = await pool.query<ResultSetHeader>(
    `
    INSERT INTO notes (title, contents)
    VALUES (?, ?)	
  `,
    [title, contents]
  );
  const newStoreId = result.insertId;
  const newStoreData = await getStoreById(newStoreId);
  return newStoreData;
};

export { pool, getAllNotes, getStoreById, createStore };
