import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password_hash: { type: String, required: true },
  resume_url: { type: String, default: null },
  target_role: { type: String, default: '' },
  total_sessions: { type: Number, default: 0 },
  avg_score: { type: Number, default: 0 }
}, { timestamps: true })

userSchema.pre('save', async function (next) {
  if (!this.isModified('password_hash')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password_hash = await bcrypt.hash(this.password_hash, salt)
  next()
})

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password_hash)
}

userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password_hash
  return obj
}

const User = mongoose.model('User', userSchema)
export default User