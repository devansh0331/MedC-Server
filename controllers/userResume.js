import UserResume from "../models/UserResume.js";

export const addResume = async (req, res) => {
  try {
    const user = req.user.id;

    // uploading resume
    if (req.file && req.file.path) {
      console.log(req.file.path);
      const file = req.file.path;
      const result = await cloudinary.uploader.upload(file);
      fileURL = result.secure_url;
    }

    const newResume = await UserResume({
      user,
      resume: fileURL,
    });

    await newResume.save();
    res
      .status(200)
      .json({ success: true, message: "Resume Uploaded Successfully" });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: "Failed to upload resume",
    });
  }
};

export const getResume = async (req, res) => {
  try {
    const user = req.user.id;
    const resume = await UserResume.find(user);
    if (!resume || resume.length == 0) {
      return res.status(404).json({
        success: false,
        error: "Resume not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: "Failed to get resume",
    });
  }
};

export const removeResume = async (req, res) => {
  try {
    const id = req.params.id;
    await UserResume.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Removed Successfully!" });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: "Failed to remove resume",
    });
  }
};
