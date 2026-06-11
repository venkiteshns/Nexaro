import mongoose from "mongoose";

const bidSchema = new mongoose,Schema({
    taskId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Tasks"
    },
    workerId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    amount:{
        type: Number,
        required: true
    },
    eta:{
        type: Number,
        required: true,
    },
    pitch: {
        type: String,
        required: true
    },
    availability:{
        type:Date,
        required: true
    },
    status:{
        
    }

})


// bids [icon: play-circle, color: yellow] {
//   id ObjectId
//   taskId ObjectId fk
//   workerId ObjectId fk
//   amount number
//   eta number
//   pitch string
//   availability date
//   status string
//   createdAt timestamp
// }