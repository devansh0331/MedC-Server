import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("friends");
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* POST */
export const friendAction = async (req, res) => {
  try {
    const { id } = req.body;
    const friendId = req.params.id;
    const user = await User.findById(id);
    if (!user.friends) {
      user.friends = [];
    }

    const isFriend = user.friends.includes(friendId);
    console.log(isFriend);

    if (!isFriend) user.friends.push(friendId);
    else user.friends.pop(friendId);

    await user.save();

    res.status(200).json({ success: true, message: user.friends });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

/* POST */
export const getAllFriends = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findById(id).populate("friends");
    res.status(200).json({ success: true, message: user.friends });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
};

export const addFriend = async (req, res) => {
  try {
    const friendId = req.params.id;
    console.log(friendId);
    const { id } = req.body;

    const user = await User.findById(id);

    const isRequested = user.pending;

    if (!user.pending) {
      user.pending = new Map();
    }

    if (isRequested) {
      user.pending.delete(friendId);
    } else {
      user.pending.set(friendId, true);
    }

    const updatedRequest = await User.findByIdAndUpdate(
      id,
      { pending: user.pending },
      { new: true }
    );

    res.status(200).json({ success: true, data: updatedRequest });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
};

export const friendRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("pending");
    res.status(200).json({ success: true, data: user.pending });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const friendId = req.params.id;
    const userId = req.user.id;
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
    if (user.pending.get(friendId)) {
      user.pending.delete(friendId);
      user.friends.push(friendId);
      friend.friends.push(userId);
    }
    await user.save();
    await friend.save();
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
};

export const deleteFriendRequest = async (req, res) => {
  try {
    const friendId = req.params.id;
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (user.pending.get(friendId)) {
      user.pending.delete(friendId);
    }
    await user.save();
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
};
