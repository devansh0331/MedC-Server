import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    // let { token } = req.header("Authorization");
    var token = req.cookies.token;

    console.log("TOKEN: " + token);
    if (!token) {
      return res.status(403).json("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    req.user = verified; // -> verified = userId
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
