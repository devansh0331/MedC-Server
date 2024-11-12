import UserResume from "../models/UserResume.js";
import { v2 as cloudinary } from "cloudinary";

export const addResume = async (req, res) => {
  try {
    const { fileName, fileURL } = req.body;
    const user = req.user.id;

    if (fileURL != undefined) {
      await UserResume.create({
        userId: user,
        resumeURL: fileURL,
        resumeName: fileName,
      });

      // await newResume.save();
      res
        .status(200)
        .json({ success: true, message: "Resume Uploaded Successfully" });
    } else {
      res
        .status(400)
        .json({ success: false, error: "Please select your Resume" });
    }
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

    const resume = await UserResume.find({ userId: user });

    if (!resume) {
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

export const getAllResume = async (req, res) => {
  try {
    const resumes = await UserResume.find();
    return res.status(200).json({
      success: true,
      data: resumes,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: "Failed to get resumes",
    });
  }
};
