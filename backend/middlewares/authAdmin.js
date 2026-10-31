import jwt from "jsonwebtoken";

const authAdmin = (req, res, next) => {
  try {
    let token = req.headers.atoken;
    const authHeader = req.headers.authorization;

    if (!token && authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Yêu cầu quyền Quản trị viên. Vui lòng đăng nhập lại!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res
        .status(403)
        .json({ success: false, message: "Không có quyền truy cập: Token quản trị không hợp lệ" });
    }

    next();
  } catch (error) {
    return res
      .status(403)
      .json({ success: false, message: "Phiên đăng nhập quản trị đã hết hạn hoặc không hợp lệ" });
  }
};

export default authAdmin;
