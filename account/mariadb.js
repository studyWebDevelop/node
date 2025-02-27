const mysql = require("mysql2");

// MySQL 연결 생성
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "Youtube",
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
