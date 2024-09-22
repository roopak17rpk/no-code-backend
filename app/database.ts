import mysql, { OkPacket, ResultSetHeader } from "mysql2";
import { Store } from "./api/getStoreById/storeTypes";

type EditStoreInfoParams = {
  storeId: number;
  storeName: string | null;
  ownerName: string | null;
};

// Database connection configuration
const dbConfig = {
  host: process.env.NEXT_PUBLIC_MY_SQL_REMOTE_HOST,
  user: process.env.NEXT_PUBLIC_MY_SQL_REMOTE_USER,
  password: process.env.NEXT_PUBLIC_MY_SQL_REMOTE_PASSWORD,
  database: process.env.NEXT_PUBLIC_MY_SQL_REMOTE_DATABASE,
  port: Number(process.env.NEXT_PUBLIC_MY_SQL_REMOTE_PORT),
};

// Create a connection pool
const pool = mysql.createPool(dbConfig).promise();

/**
 * Fetches a store from the database by its ID.
 * @param {number} storeId - The ID of the store to fetch.
 * @returns {Promise<Store | null>} The fetched store, or null if not found.
 * @throws {Error} If there is an error while fetching the store.
 */
async function getStoreById(storeId: number): Promise<Store | null> {
  try {
    const [rows] = await pool.query("SELECT * FROM storeInfo WHERE id = ?", [
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

const createStore = async (
  storeName: string,
  storeOwnerInfo: { name: string },
  storeDomain: string
) => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `
      INSERT INTO storeInfo (store_name, store_owner_info, store_domain)
      VALUES (?, ?, ?)	
    `,
      [storeName, JSON.stringify(storeOwnerInfo), storeDomain]
    );

    if (result.affectedRows === 0) {
      throw new Error("Store creation failed, no rows affected.");
    }

    const newStoreId = result.insertId;
    const newStoreData = await getStoreById(newStoreId);

    if (!newStoreData) {
      throw new Error("Store not found after creation.");
    }

    return newStoreData;
  } catch (error) {
    console.error("Error creating store:", error);
    throw new Error("An error occurred while creating the store.");
  }
};

async function editStoreInfo(params: EditStoreInfoParams) {
  try {
    const { storeId, storeName = null, ownerName = null } = params;
    const updatedOwnerName = ownerName
      ? JSON.stringify({ name: ownerName })
      : null;
    const [result] = await pool.query<ResultSetHeader>(
      `
      UPDATE storeInfo
      SET
		   store_name = COALESCE(?, store_name), 
       store_owner_info = COALESCE(?, store_owner_info)
      WHERE id = ?
    `,
      [storeName, updatedOwnerName, storeId]
    );

    if (result.affectedRows === 0) {
      throw new Error("Store update failed, no rows affected.");
    }

    const updatedStoreData = await getStoreById(storeId);

    if (!updatedStoreData) {
      throw new Error("Store not found after update.");
    }

    return updatedStoreData;
  } catch (error) {
    console.error("Error updating store info:", error);
    throw new Error("An error occurred while updating the store info.");
  }
}

export { pool, getStoreById, createStore, editStoreInfo };
