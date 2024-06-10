import jwt from "jsonwebtoken";
import Cookies from "js-cookie";
import { ExpressCookies } from "../index.js";

export const verifyToken = async (req, res, next) => {
  try {
    // let { token } = req.header("Authorization");
    // var token = ExpressCookies({ read: token });
    var token = req.cookies.token;
    // const authHeader = req.headers;
    // console.log(authHeader);
    console.log("TOKEN: " + token);
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
    console.log(err);
    res.status(500).json({ success: false, status: 500, error: err.message });
  }
};
