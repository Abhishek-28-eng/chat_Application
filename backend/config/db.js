const mysql = require("mysql2");

const dbConnections = {}; // Store database connections for each school

function getDatabaseConnection(dbName) {
  if (!dbConnections[dbName]) {
    dbConnections[dbName] = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: dbName, // Connect dynamically
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    }).promise();
  }
  return dbConnections[dbName];
}

module.exports = getDatabaseConnection;
