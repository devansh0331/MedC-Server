import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    var token = req.header("Authorization");

    if (!token) {
      return res
        .status(403)
        .json({ success: false, status: 403, error: "Access Denied" });
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    req.user = verified; // -> verified = userId
    next();
  } catch (err) {
    res.status(500).json({ success: false, status: 500, error: err.message });
  }
};
