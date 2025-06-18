const mysql = require("mysql2/promise");
require("dotenv").config();

// Database configuration for Aiven Cloud MySQL
const dbConfig = {
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT) || 20090,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "auth_system", // Include database in connection
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    ca: process.env.DB_SSL_CERT,
    rejectUnauthorized: false, // Handle self-signed certificates
  },
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Initialize database and create tables
const initializeDatabase = async () => {
  try {
    console.log("Connecting to Aiven MySQL database...");

    // Test connection
    const connection = await pool.getConnection();
    console.log("✅ Connected to Aiven MySQL database successfully");

    // Check if we're connected to the right database
    const [rows] = await connection.execute("SELECT DATABASE() as current_db");
    console.log(`✅ Using database: ${rows[0].current_db}`);

    // Create users table
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid VARCHAR(36) NOT NULL UNIQUE,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_uuid (uuid)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `;

    // Create password reset tokens table
    const createResetTokensTable = `
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token VARCHAR(255) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_token (token),
        INDEX idx_expires_at (expires_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `;

    await connection.execute(createUsersTable);
    console.log("✅ Users table created/verified");

    await connection.execute(createResetTokensTable);
    console.log("✅ Password reset tokens table created/verified");

    // Verify tables exist
    const [tables] = await connection.execute("SHOW TABLES");
    console.log(
      "✅ Available tables:",
      tables.map((t) => Object.values(t)[0])
    );

    connection.release();
    console.log("✅ Database initialization completed successfully");
  } catch (error) {
    console.error("❌ Database initialization error:", error);

    // More detailed error logging
    if (error.code === "ECONNREFUSED") {
      console.error(
        "❌ Connection refused. Check your database host and port."
      );
    } else if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.error(
        "❌ Access denied. Check your database username and password."
      );
    } else if (error.code === "ENOTFOUND") {
      console.error("❌ Host not found. Check your database host URL.");
    } else if (error.code === "HANDSHAKE_SSL_ERROR") {
      console.error("❌ SSL handshake error. Trying with SSL disabled...");
      await initializeDatabaseWithoutSSL();
      return;
    } else if (
      error.message.includes("SSL") ||
      error.message.includes("certificate")
    ) {
      console.error("❌ SSL certificate error. Trying with SSL disabled...");
      await initializeDatabaseWithoutSSL();
      return;
    } else if (error.code === "ER_UNSUPPORTED_PS") {
      console.error(
        "❌ Prepared statement error. This shouldn't happen with the current setup."
      );
    }

    throw error;
  }
};

// Fallback initialization without SSL
const initializeDatabaseWithoutSSL = async () => {
  try {
    console.log("🔄 Attempting connection without SSL...");

    const fallbackConfig = {
      ...dbConfig,
      ssl: false,
    };

    const fallbackPool = mysql.createPool(fallbackConfig);
    const connection = await fallbackPool.getConnection();

    console.log("✅ Connected to database without SSL");

    // Check current database
    const [rows] = await connection.execute("SELECT DATABASE() as current_db");
    console.log(`✅ Using database: ${rows[0].current_db}`);

    // Create tables (same as above)
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid VARCHAR(36) NOT NULL UNIQUE,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_uuid (uuid)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `;

    const createResetTokensTable = `
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token VARCHAR(255) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_token (token),
        INDEX idx_expires_at (expires_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `;

    await connection.execute(createUsersTable);
    console.log("✅ Users table created/verified");

    await connection.execute(createResetTokensTable);
    console.log("✅ Password reset tokens table created/verified");

    // Verify tables exist
    const [tables] = await connection.execute("SHOW TABLES");
    console.log(
      "✅ Available tables:",
      tables.map((t) => Object.values(t)[0])
    );

    connection.release();
    console.log(
      "✅ Database initialization completed successfully (without SSL)"
    );

    // Update the global pool to use the working configuration
    module.exports.pool = fallbackPool;
  } catch (fallbackError) {
    console.error("❌ Failed to connect even without SSL:", fallbackError);
    throw fallbackError;
  }
};

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log("✅ Database connection test successful");
    return true;
  } catch (error) {
    console.error("❌ Database connection test failed:", error);
    return false;
  }
};

module.exports = {
  pool,
  initializeDatabase,
  testConnection,
};
