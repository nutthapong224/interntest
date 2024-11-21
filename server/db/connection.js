const mysql = require('mysql2');
require('dotenv').config();

// สร้าง Connection Pool แทนการใช้ createConnection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,  // คอยให้การเชื่อมต่อพร้อมใช้
  connectionLimit: 10,       // จำนวนการเชื่อมต่อสูงสุด
  queueLimit: 0              // จำนวนคำขอคิวที่รอการเชื่อมต่อ
});

// ใช้ pool.getConnection() ในการรับ connection แทนการสร้าง connection ใหม่ทุกครั้ง
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    process.exit(1); // Exit the application if connection fails
  }
  console.log('Connected to the MySQL database!');
  connection.release(); // รีลีส connection เมื่อใช้งานเสร็จ
});

module.exports = pool;
