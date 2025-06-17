require('dotenv').config();
const mysql = require('mysql2');

// Buat koneksi
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  timezone: '+07:00',
});

// Fungsi untuk inisialisasi database (buat tabel saja)
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.connect((err) => {
      if (err) {
        console.error('❌ Gagal terhubung ke MySQL:', err.message);
        reject(err);
        return;
      }
      console.log('✅ Terhubung ke MySQL');

      // Buat tabel `users`
      const usersTable = `
        CREATE TABLE IF NOT EXISTS users (
          user_id INT AUTO_INCREMENT PRIMARY KEY,
          jenis_kelamin ENUM('Laki-laki', 'Perempuan'),
          usia INT(3),
          tinggi_badan FLOAT,
          berat_badan FLOAT,
          aktivitas ENUM('ringan', 'sedang', 'berat'),
          porsi_makan INT(2)
        )
      `;

      db.query(usersTable, (err) => {
        if (err) {
          console.error('❌ Gagal membuat tabel `users`:', err.message);
          reject(err);
          return;
        }
        console.log('✅ Tabel `users` berhasil dibuat');

        // Buat tabel `profil`
        const profilTable = `
          CREATE TABLE IF NOT EXISTS profil (
            id_profil INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            nama VARCHAR(150),
            foto LONGTEXT,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
          )
        `;

        db.query(profilTable, (err) => {
          if (err) {
            console.error('❌ Gagal membuat tabel `profil`:', err.message);
            reject(err);
            return;
          }
          console.log('✅ Tabel `profil` berhasil dibuat');

          // Buat tabel `riwayat`
          const riwayatTable = `
            CREATE TABLE IF NOT EXISTS riwayat (
              id_riwayat INT AUTO_INCREMENT PRIMARY KEY,
              user_id INT,
              image LONGTEXT,
              name VARCHAR(150),
              calories DECIMAL(8,2),
              protein DECIMAL(8,2),
              carbs DECIMAL(8,2),
              fat DECIMAL(8,2),
              tanggal DATETIME DEFAULT CURRENT_TIMESTAMP,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            )
          `;

          db.query(riwayatTable, (err) => {
            if (err) {
              console.error('❌ Gagal membuat tabel `riwayat`:', err.message);
              reject(err);
              return;
            }
            console.log('✅ Tabel `riwayat` berhasil dibuat');
            resolve(db);
          });
        });
      });
    });
  });
};

// Export koneksi dan fungsi inisialisasi
module.exports = {
  db,
  initializeDatabase
};


// require('dotenv').config();
// const mysql = require('mysql2');

// // Buat connection pool
// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   timezone: '+07:00',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// // Gunakan .promise() agar bisa pakai async/await
// const db = pool.promise();

// // Fungsi untuk inisialisasi database
// const initializeDatabase = async () => {
//   try {
//     await db.query(`
//       CREATE TABLE IF NOT EXISTS users (
//         user_id INT AUTO_INCREMENT PRIMARY KEY,
//         jenis_kelamin ENUM('Laki-laki', 'Perempuan'),
//         usia INT(3),
//         tinggi_badan FLOAT,
//         berat_badan FLOAT,
//         aktivitas ENUM('ringan', 'sedang', 'berat'),
//         porsi_makan INT(2)
//       )
//     `);
//     console.log('✅ Tabel `users` berhasil dibuat');

//     await db.query(`
//       CREATE TABLE IF NOT EXISTS profil (
//         id_profil INT AUTO_INCREMENT PRIMARY KEY,
//         user_id INT,
//         nama VARCHAR(150),
//         foto LONGTEXT,
//         FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
//       )
//     `);
//     console.log('✅ Tabel `profil` berhasil dibuat');

//     await db.query(`
//       CREATE TABLE IF NOT EXISTS riwayat (
//         id_riwayat INT AUTO_INCREMENT PRIMARY KEY,
//         user_id INT,
//         image LONGTEXT,
//         name VARCHAR(150),
//         calories DECIMAL(8,2),
//         protein DECIMAL(8,2),
//         carbs DECIMAL(8,2),
//         fat DECIMAL(8,2),
//         tanggal DATETIME DEFAULT CURRENT_TIMESTAMP,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//         FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
//       )
//     `);
//     console.log('✅ Tabel `riwayat` berhasil dibuat');
//   } catch (err) {
//     console.error('❌ Gagal membuat tabel:', err.message);
//     throw err;
//   }
// };

// // Export koneksi dan fungsi
// module.exports = {
//   db,
//   initializeDatabase
// };
