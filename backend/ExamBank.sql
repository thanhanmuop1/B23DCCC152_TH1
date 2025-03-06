-- Bảng danh mục khối kiến thức
CREATE TABLE DanhMucKhoiKienThuc (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ten_danh_muc VARCHAR(255) NOT NULL UNIQUE
);

INSERT INTO DanhMucKhoiKienThuc (ten_danh_muc) VALUES
('Tổng quan'),
('Chuyên sâu');

-- Bảng quản lý môn học
CREATE TABLE MonHoc (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_mon VARCHAR(50) UNIQUE NOT NULL,
    ten_mon VARCHAR(255) NOT NULL,
    so_tin_chi INT NOT NULL
);

INSERT INTO MonHoc (ma_mon, ten_mon, so_tin_chi) VALUES
('CS101', 'Khoa học máy tính cơ bản', 3),
('MATH201', 'Toán rời rạc', 4);

-- Bảng quản lý khối kiến thức
CREATE TABLE KhoiKienThuc (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ten_khoi VARCHAR(255) NOT NULL,
    mon_hoc_id INT NOT NULL,
    danh_muc_id INT,
    FOREIGN KEY (mon_hoc_id) REFERENCES MonHoc(id) ON DELETE CASCADE,
    FOREIGN KEY (danh_muc_id) REFERENCES DanhMucKhoiKienThuc(id) ON DELETE SET NULL
);

INSERT INTO KhoiKienThuc (ten_khoi, mon_hoc_id, danh_muc_id) VALUES
('Lập trình cơ bản', 1, 1),
('Lý thuyết đồ thị', 2, 2);

-- Bảng quản lý câu hỏi tự luận
CREATE TABLE CauHoi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    noi_dung TEXT NOT NULL,
    muc_do ENUM('Dễ', 'Trung bình', 'Khó', 'Rất khó') NOT NULL,
    khoi_kien_thuc_id INT NOT NULL,
    FOREIGN KEY (khoi_kien_thuc_id) REFERENCES KhoiKienThuc(id) ON DELETE CASCADE
);

INSERT INTO CauHoi (noi_dung, muc_do, khoi_kien_thuc_id) VALUES
('Trình bày các kiểu dữ liệu cơ bản trong lập trình.', 'Dễ', 1),
('Giải thích thuật toán Dijkstra và ứng dụng của nó.', 'Khó', 2);

-- Bảng quản lý cấu trúc đề thi
CREATE TABLE CauTrucDeThi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mon_hoc_id INT NOT NULL,
    muc_do ENUM('Dễ', 'Trung bình', 'Khó', 'Rất khó') NOT NULL,
    khoi_kien_thuc_id INT NOT NULL,
    so_luong INT NOT NULL,
    FOREIGN KEY (mon_hoc_id) REFERENCES MonHoc(id) ON DELETE CASCADE,
    FOREIGN KEY (khoi_kien_thuc_id) REFERENCES KhoiKienThuc(id) ON DELETE CASCADE
);

INSERT INTO CauTrucDeThi (mon_hoc_id, muc_do, khoi_kien_thuc_id, so_luong) VALUES
(1, 'Dễ', 1, 2),
(2, 'Khó', 2, 1);

-- Bảng quản lý đề thi
CREATE TABLE DeThi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mon_hoc_id INT NOT NULL,
    ten_de VARCHAR(255) NOT NULL,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mon_hoc_id) REFERENCES MonHoc(id) ON DELETE CASCADE
);

INSERT INTO DeThi (mon_hoc_id, ten_de) VALUES
(1, 'Đề thi lập trình cơ bản'),
(2, 'Đề thi Toán rời rạc');

-- Bảng liên kết đề thi với câu hỏi
CREATE TABLE DeThi_CauHoi (
    de_thi_id INT NOT NULL,
    cau_hoi_id INT NOT NULL,
    PRIMARY KEY (de_thi_id, cau_hoi_id),
    FOREIGN KEY (de_thi_id) REFERENCES DeThi(id) ON DELETE CASCADE,
    FOREIGN KEY (cau_hoi_id) REFERENCES CauHoi(id) ON DELETE CASCADE
);

INSERT INTO DeThi_CauHoi (de_thi_id, cau_hoi_id) VALUES
(1, 1),
(2, 2);
