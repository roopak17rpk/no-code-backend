import mysql from "mysql2";

// Database connection configuration
const dbConfig = {
  host: process.env.NEXT_PUBLIC_MY_SQL_HOST,
  user: process.env.NEXT_PUBLIC_MY_SQL_USER,
  password: process.env.NEXT_PUBLIC_MY_SQL_PASSWORD,
  database: process.env.NEXT_PUBLIC_MY_SQL_DATABASE,
};

console.log("Database configuration:", dbConfig);
console.log("Environment variables:", process.env);

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

async function getStoreById(store_id: number) {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM notes WHERE id = ${store_id}`
    );
    return rows;
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

export { pool, getAllNotes, getStoreById };
