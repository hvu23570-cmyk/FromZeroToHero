import { Database } from "bun:sqlite";
export const db = new Database("db/database.sqlite");

db.run(`
-- Tạo bảng users nếu chưa tồn tại 
CREATE TABLE IF NOT EXISTS users(

    --id: khóa chính, số nguyên tự động tăng
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    -- email: email
    -- UNIQUE: không được trùng
    -- NOT NULL: không được để trống, bắt buộc phải có
    email TEXT UNIQUE NOT NULL,

    --passwordHash đã được mã hóa (hash)
    passwordHash TEXT NOT NULL,


    --createdAt: thời điểm tạo tài khoản
    -- DEFAULT CURRENT_TIMESTAMP: tự động lấy thời gian default hiện tại
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
   )
`);

db.run(`
-- Tạo bảng tasks nếu chưa tồn tại
CREATE TABLE IF NOT EXISTS tasks(

    --id: khóa chính, số nguyên tự động tăng
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    --userId: id của user sở hữu task này ko được để trống NOT NULL
    userId INTEGER NOT NULL,

    --title: tiêu đề không được để trống not null
    title TEXT NOT NULL,

    --status: trạng thái công việc mặc định là đang chờ
    status TEXT DEFAULT 'pending',

    --createdAt: thời điểm tạo task tự động lấy thời gian default hiện tại
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    --updatedAt: thời điểm cập nhật task lần cuối
    --backend sẽ cập nhật lại khi sửa task
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    --Khóa ngoại: userId phải tồn tại trong users.id
    --đảm bảo task luôn thuộc về user hợp lệ
    FOREIGN KEY (userId) REFERENCES users(id)
  )
`);
