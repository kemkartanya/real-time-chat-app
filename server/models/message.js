import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  username:{
    type: String,
    required: true
  },
//   user_avatar: {
//     type: String,
//     required: false
//   },
  content: {
    type: String,
    required: true
  }
},{
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
})

export default mongoose.model('Message',messageSchema);