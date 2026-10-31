import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token = "";

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.headers.token) {
      token = req.headers.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Vui lòng đăng nhập để tiếp tục thao tác",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!req.body) {
      req.body = {};
    }

    req.body.userId = decoded.id;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(403).json({
      success: false,
      message: "Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại",
    });
  }
};

export default authUser;
