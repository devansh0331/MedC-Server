import FriendListStatus from "../models/FriendStatus.js";
import User from "../models/User.js";

/* READ */
export const getSingleUser = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("User Id: ", userId);
    const id = req.user.id;
    console.log("Id: ", id);
    const user = await User.findById(userId, {
      password: 0,
      isGoogleSignIn: 0,
    }).populate("friendList");
    if (!user)
      res.status(400).json({ success: false, error: "User not found" });
    res
      .status(200)
      .json({ success: true, data: user, isExisting: userId == id });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
};
/* READ */
export const getAllUser = async (req, res) => {
  try {
    const user = req.user.id;
    if (!user) res.status(400).json({ success: false, error: "Access Denied" });
    const users = await User.find(
      {},
      { name: 1, _id: 1, location: 1, bio: 1, profileURL: 1 }
    ).limit(15);

    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
};

export const sendRequest = async (req, res) => {
  try {
    const userId = "66593e0052fcb6e5f19afdff"; //req.user.id;
    const friendId = "66502d9022d3c10ef958c02a"; // req.params.id;
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
      // console.log(user.friendList);
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
      // console.log(friend.friendList);
    }
    // console.log(userInFriendList);
    const checkFriendOfUser = userInFriendList.friendStatus.get(friendId);
    const checkUserOfFriend = friendInFriendList.friendStatus.get(userId);

    if (!checkFriendOfUser) {
      userInFriendList.friendStatus.set(friendId, 1);
    } else if (checkFriendOfUser) {
      if (checkFriendOfUser.status == 1 || checkFriendOfUser == 3)
        userInFriendList.friendStatus.delete(friendId);
    }
    if (!checkUserOfFriend) {
      friendInFriendList.friendStatus.set(userId, 2);
    } else if (checkUserOfFriend.status == 2 || checkUserOfFriend == 3) {
      friendInFriendList.friendStatus.delete(userId);
    }
    await FriendListStatus.findByIdAndUpdate(userInFriendList._id, {
      friendStatus: userInFriendList.friendStatus,
    });
    await FriendListStatus.findByIdAndUpdate(friendInFriendList._id, {
      friendStatus: friendInFriendList.friendStatus,
    });
    // console.log(userInFriendList);
  } catch (error) {
    console.log(error.message);
  }
};

export const acceptRequest = async (req, res) => {
  try {
    const userId = "66502d9022d3c10ef958c02a"; //req.user.id;
    const friendId = "66593e0052fcb6e5f19afdff"; // req.params.id;

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

    console.log("friend id: ", friendId);

    const userInFriendList = await FriendListStatus.findOne({
      userId,
    });

    console.log(userInFriendList);
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
          console.log(arr);
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
          console.log(arr);
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
    console.log(userId);
    const singleUser = await User.findById(userId);
    console.log(singleUser);
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
          console.log(arr);
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
