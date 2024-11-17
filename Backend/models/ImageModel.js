import mongoose from "mongoose";
const ImageSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
});
const ImageModel = mongoose.model("User", ImageSchema);
export default ImageModel;