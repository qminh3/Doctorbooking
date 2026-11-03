import { v2 as cloudinary } from "cloudinary";

/**
 * Upload hình ảnh từ buffer trong RAM trực tiếp lên Cloudinary qua luồng Stream
 * @param {Buffer} buffer - Buffer file từ Multer MemoryStorage
 * @param {Object} customOptions - Tùy chọn cấu hình Cloudinary (folder, transformation, v.v.)
 * @returns {Promise<string>} secure_url của ảnh đã được nén & tối ưu
 */
export const uploadImageBuffer = (buffer, customOptions = {}) => {
  return new Promise((resolve, reject) => {
    const defaultOptions = {
      resource_type: "image",
      folder: "booking_doctor",
      // Tự động nhận diện trình duyệt để trả về WebP/AVIF siêu nhẹ
      fetch_format: "auto",
      // Tự động nén dung lượng mà vẫn giữ độ nét cao
      quality: "auto:good",
      transformation: [
        { width: 800, height: 800, crop: "limit" }, // Giới hạn kích thước tối đa 800px
      ],
      ...customOptions,
    };

    const stream = cloudinary.uploader.upload_stream(
      defaultOptions,
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload stream error:", error);
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );

    stream.end(buffer);
  });
};

/**
 * Xóa ảnh cũ trên Cloudinary để giải phóng dung lượng khi cập nhật ảnh mới
 * @param {string} publicId
 */
export const deleteCloudinaryImage = async (publicId) => {
  try {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Lỗi khi xóa ảnh cũ trên Cloudinary:", error);
  }
};
