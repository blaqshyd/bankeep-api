import mongoose from "mongoose";

const timelineSchema = mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true,
    },
})


export default timelineSchema;