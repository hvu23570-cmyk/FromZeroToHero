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
);
