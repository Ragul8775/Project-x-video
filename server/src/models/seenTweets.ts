import mongoose, { Types } from "mongoose";

const seenTweetsSchema = new mongoose.Schema({
  agentId: {
    type: Types.ObjectId,
    required: true,
    index: true,
  },
  tweetId: {
    type: String,
    required: true,
  },
  seenAt: {
    type: Date,
    default: Date.now,
    expires: 604800, // Auto delete after 7 days
  },
});

const SeenTweets =
  mongoose.models.SeenTweets || mongoose.model("SeenTweets", seenTweetsSchema);

export default SeenTweets;
