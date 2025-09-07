import jwt from "jsonwebtoken";

const authAdmin = (req, res, next) => {
  try {
    const { atoken } = req.headers;
    if (!atoken) {
      return res
        .status(401)
        .json({ success: false, message: "Access token is required" });
    }
    const decoded = jwt.verify(atoken, process.env.JWT_SECRET);
    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: Invalid token" });
    }

    // const authHeader = req.headers.authorization;

    // if (!authHeader || !authHeader.startsWith("Bearer ")) {
    //   return res
    //     .status(401)
    //     .json({ success: false, message: "Access token is required" });
    // }

    // const token = authHeader.split(" ")[1];
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // if (decoded.email !== process.env.ADMIN_EMAIL) {
    //   return res
    //     .status(403)
    //     .json({ success: false, message: "Forbidden: Invalid token" });
    // }

    next();
  } catch (error) {
    return res
      .status(403)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

export default authAdmin;
