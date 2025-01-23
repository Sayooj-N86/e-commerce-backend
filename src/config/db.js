import mongoose from "mongoose";
import env from "../../env.js";

const ConnectDB = async () => {
  try {
    mongoose
      .connect(env.MONGO_CONNECTION_STRING)
      .then(() => console.log("Mongodb connected successfully"));
  } catch (err) {
    console.log(err);
  }
};
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected!");
}),
  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected!");
  });

export default ConnectDB;