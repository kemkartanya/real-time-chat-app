import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username:{
    type: String,
    required: true
  },
//   user_avatar: {
//     type: String,
//     required: false
//   },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["client", "admin"],
    default: "client",
  },
})

export default mongoose.model('User', userSchema);

