const mongoose = require('mongoose');
const { Schema } = mongoose;

const IssueSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["open", "closed"],
        default: "open"
    },
    repository:{
        type: Schema.Types.ObjectId,
        ref: "Repository" ,
        required : true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    comments: [{
        user: { type: Schema.Types.ObjectId, ref: "User" },
        username: { type: String, default: "User" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }]
});

const Issue = mongoose.model ("Issue" , IssueSchema);
module.exports = Issue;