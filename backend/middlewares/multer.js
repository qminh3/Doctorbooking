import multer from "multer";

// Sử dụng memoryStorage để lưu file tạm trực tiếp trong RAM (dưới dạng Buffer)
// Tránh việc ghi file ra ổ đĩa máy chủ (Disk I/O), loại bỏ nguy cơ tràn ổ đĩa theo thời gian
const storage = multer.memoryStorage();

// Bộ lọc định dạng file: Chỉ chấp nhận các định dạng ảnh hợp lệ
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Định dạng tệp không được hỗ trợ. Vui lòng tải lên ảnh JPG, PNG hoặc WebP!"
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn kích thước tối đa 5MB
  },
  fileFilter,
});

export default upload;
