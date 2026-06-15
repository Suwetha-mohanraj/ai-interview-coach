import User from '../models/user.model.js'

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    res.status(200).json({ success: true, user })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { name, target_role } = req.body
    const user = await User.findByIdAndUpdate(req.user._id, { name, target_role }, { new: true })
    res.status(200).json({ success: true, user })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}