import Admin from "../models/Admin.js";

export const verifyAdmin = async (req, res, next) => {
  try {
    const id = req.user.id;
    console.log("Call from admin");
    
    const isAdmin = await Admin.findOne({ userId: id });
    if (!isAdmin)
      return res.status(400).json({ success: false, error: "Access Denied!" });
    else {
      console.log(id);
      
      req.admin = id;
      next();
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server Error!" });
  }
};
