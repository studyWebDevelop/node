const mysql = require("mysql2");
require("dotenv").config();

// MySQL 연결 생성
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dateStrings: true,
  options: {
    encrypt: false,
  },
});

// 연결 실행
connection.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + connection.threadId);
});

module.exports = connection;
