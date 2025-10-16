import jwt from "jsonwebtoken";

const authDoctor = (req, res, next) => {
  try {
    const authorizationHeader = req.headers["authorization"];
    const legacyHeaderToken = req.headers["dtoken"];
    const bearHeaderToken = req.headers["bear"];

    let token = "";
    if (authorizationHeader && typeof authorizationHeader === "string") {
      const parts = authorizationHeader.split(" ");
      if (parts.length === 2 && parts[0] === "Bearer") {
        token = parts[1];
      }
    }
    if (!token && legacyHeaderToken) {
      token = legacyHeaderToken;
    }
    if (!token && bearHeaderToken) {
      token = bearHeaderToken;
    }

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Access token is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!req.body) {
      req.body = {};
    }
    req.body.docId = decoded.id;
    return next();
  } catch (error) {
    console.error(" Token verification error:", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
export default authDoctor;
