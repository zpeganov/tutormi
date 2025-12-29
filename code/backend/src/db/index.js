const mysql = require('mysql2/promise');

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'tutormi',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('📦 Connected to MySQL database');
    connection.release();
  })
  .catch(err => {
    console.error('Failed to connect to MySQL:', err.message);
  });

module.exports = {
  query: async (text, params) => {
    const [rows] = await pool.execute(text, params);
    return { rows };
  },
  pool
};
