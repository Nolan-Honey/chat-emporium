const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = new Schema(
    {
        room: String,
        name: String,
        message:String,
        time: String,
    },
    {
        collection: "chats"
    }
);


module.exports = mongoose.model("chat", ChatSchema)