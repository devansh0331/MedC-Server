import Achievement from "../models/Achievement.js";
import Certificate from "../models/Certificate.js";
import Education from "../models/Education.js";
import Experience from "../models/Experience.js";
import FriendListStatus from "../models/FriendStatus.js";
import User from "../models/User.js";

/* READ */
export const getSingleUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const id = req.user.id;

    const user = await User.findById(userId, {
      password: 0,
      isGoogleSignIn: 0,
    }).populate("experience");
    if (!user)
      res.status(400).json({ success: false, error: "User not found" });
    else if (user.isDeactivated && user.isDeactivated == true) {
      return res
        .status(404)
        .json({ success: false, error: "User does not exist" });
    } else {
      return res
        .status(200)
        .json({ success: true, user: user, isExisting: userId == id });
    }
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
};
/* READ */
export const getAllUser = async (req, res) => {
  try {
    const users = await User.find(
      {
        $or: [
          { isDeactivated: { $exists: false } },
          { isDeactivated: { $eq: false } },
        ],
      },
      {
        name: 1,
        _id: 1,
        location: 1,
        bio: 1,
        profileURL: 1,
        about: 1,
        email: 1,
        isUserDeactivated: 1,
        isDeactivated: 1,
      }
    );
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
};

export const sendRequest = async (req, res) => {
  try {
    const userId = req.user.id; //"66593e0052fcb6e5f19afdff";
    const friendId = req.params.id; //"66502d9022d3c10ef958c02a";

    let userInFriendList = await FriendListStatus.findOne({ userId });
    let friendInFriendList = await FriendListStatus.findOne({
      userId: friendId,
    });

    if (!userInFriendList) {
      userInFriendList = await FriendListStatus.create({
        userId,
      });

      userInFriendList.friendStatus = new Map();

      const user = await User.findByIdAndUpdate(
        userId,
        { friendList: userInFriendList._id },
        { new: true }
      );
    }
    if (!friendInFriendList) {
      friendInFriendList = await FriendListStatus.create({
        userId: friendId,
      });

      friendInFriendList.friendStatus = new Map();
      const friend = await User.findByIdAndUpdate(
        friendId,
        { friendList: friendInFriendList._id },
        { new: true }
      );
    }
    const checkFriendOfUser = userInFriendList.friendStatus.get(friendId);
    const checkUserOfFriend = friendInFriendList.friendStatus.get(userId);

    if (!checkFriendOfUser) {
      userInFriendList.friendStatus.set(friendId, 1);
    } else if (checkFriendOfUser) {
      if (
        checkFriendOfUser.status == 1 ||
        checkFriendOfUser.status == 2 ||
        checkFriendOfUser == 3
      )
        userInFriendList.friendStatus.delete(friendId);
    }
    if (!checkUserOfFriend) {
      friendInFriendList.friendStatus.set(userId, 2);
    } else if (
      checkUserOfFriend.status == 2 ||
      checkUserOfFriend.status == 1 ||
      checkUserOfFriend == 3
    ) {
      friendInFriendList.friendStatus.delete(userId);
    }
    await FriendListStatus.findByIdAndUpdate(userInFriendList._id, {
      friendStatus: userInFriendList.friendStatus,
    });
    await FriendListStatus.findByIdAndUpdate(friendInFriendList._id, {
      friendStatus: friendInFriendList.friendStatus,
    });

    return res.json({ success: true });
  } catch (error) {
    console.log(error.message);
  }
};

export const acceptRequest = async (req, res) => {
  try {
    const userId = req.user.id; // "66502d9022d3c10ef958c02a";
    const friendId = req.params.id; // "66593e0052fcb6e5f19afdff";

    const userInFriendList = await FriendListStatus.findOne({
      userId,
    });
    const friendInFriendList = await FriendListStatus.findOne({
      userId: friendId,
    });

    if (
      userInFriendList.friendStatus.get(friendId) == 2 &&
      friendInFriendList.friendStatus.get(userId) == 1
    ) {
      userInFriendList.friendStatus.set(friendId, 3);
      friendInFriendList.friendStatus.set(userId, 3);
      await FriendListStatus.findByIdAndUpdate(userInFriendList._id, {
        friendStatus: userInFriendList.friendStatus,
      });
      await FriendListStatus.findByIdAndUpdate(friendInFriendList._id, {
        friendStatus: friendInFriendList.friendStatus,
      });
      return res.json({ success: true });
    } else {
      console.log("Failed to accept request");
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const checkFriendStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const friendId = req.params.id;

    const userInFriendList = await FriendListStatus.findOne({
      userId,
    });

    if (!userInFriendList) {
      return res.status(200).json({ success: true, data: 0 });
    } else {
      const friendInUser = userInFriendList.friendStatus.get(friendId);
      if (!friendInUser)
        return res.status(200).json({ success: true, data: 0 });
      else return res.status(200).json({ success: true, data: friendInUser });
    }
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const getReceivedRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const userInFriendList = await FriendListStatus.findOne({
      userId,
    });

    var arr = [];

    if (!userInFriendList) {
      return res
        .status(400)
        .json({ success: false, error: "No pending requests" });
    } else {
      userInFriendList.friendStatus.forEach((element, value) => {
        if (element === 2) {
          arr.push({ _id: value });
        }
      });
      if (arr.length > 0) {
        const users = await User.find({ $or: arr });
        return res.status(400).json({ success: true, data: users });
      } else {
        return res
          .status(400)
          .json({ success: false, error: "No pending requests!" });
      }
    }
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
export const getSentRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const userInFriendList = await FriendListStatus.findOne({
      userId,
    });

    var arr = [];

    if (!userInFriendList) {
      return res
        .status(400)
        .json({ success: false, error: "No sent requests" });
    } else {
      userInFriendList.friendStatus.forEach((element, value) => {
        if (element === 1) {
          arr.push({ _id: value });
        }
      });
      if (arr.length > 0) {
        const users = await User.find({ $or: arr });
        return res.status(400).json({ success: true, data: users });
      } else {
        return res
          .status(400)
          .json({ success: false, error: "No sent requests!" });
      }
    }
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
export const getConnections = async (req, res) => {
  try {
    const userId = req.user.id;

    const singleUser = await User.findById(userId);

    const userInFriendList = await FriendListStatus.findOne({
      userId,
    });

    var arr = [];

    if (!userInFriendList) {
      return res.status(400).json({ success: false, error: "No connections!" });
    } else {
      userInFriendList.friendStatus.forEach((element, value) => {
        if (element === 3) {
          arr.push({ _id: value });
        }
      });
      if (arr.length > 0) {
        const users = await User.find({ $or: arr });
        return res.status(400).json({ success: true, data: users });
      } else {
        return res
          .status(400)
          .json({ success: false, error: "No connections!" });
      }
    }
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
export const getUserExperience = async (req, res) => {
  try {
    const id = req.params.id;
    const experience = await Experience.find({ userId: id });
    res.status(200).json({ success: true, data: experience });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};
export const getUserEducation = async (req, res) => {
  try {
    const id = req.params.id;
    const education = await Education.find({ userId: id });
    res.status(200).json({ success: true, data: education });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};
export const getUserAchievement = async (req, res) => {
  try {
    const id = req.params.id;
    const achievement = await Achievement.find({ userId: id });
    res.status(200).json({ success: true, data: achievement });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};
export const getUserCertificate = async (req, res) => {
  try {
    const id = req.params.id;
    const certificate = await Certificate.find({ userId: id });
    res.status(200).json({ success: true, data: certificate });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};
export const deactivateAccountbyUser = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: "User does not exists!" });
    } else {
      if (!user.isUserDeactivated || user.isUserDeactivated == false) {
        await User.findByIdAndUpdate(
          id,
          { isUserDeactivated: true, isDeactivated: true },
          { new: true }
        );
        return res.status(200).json({
          success: true,
          message: "Account Deactivated Successfully!",
        });
      } else {
        return res
          .status(400)
          .json({ success: false, error: "Cannot deactivate account!" });
      }
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
