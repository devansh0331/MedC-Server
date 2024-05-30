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
