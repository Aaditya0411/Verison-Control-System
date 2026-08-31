const mongoose = require('mongoose');
const { Schema } = mongoose;


const RepositorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description : {
        type : String,
    },
    content : [{
        type : String
    }],
    visibility : {
        type : Boolean,
    },
    owner : {
        type :   Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    issues : [
        {
            type :   Schema.Types.ObjectId,
            ref : "Issue",
        }
    ],
    files: [{
        path: { type: String, required: true },
        code: { type: String, default: "" },
        updatedAt: { type: Date, default: Date.now }
    }],
    commits: [{
        id: { type: String },
        message: { type: String },
        author: { type: Schema.Types.ObjectId, ref: "User" },
        authorName: { type: String },
        date: { type: Date, default: Date.now }
    }],
    stars: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]
});

const Repository = mongoose.model("Repository" ,RepositorySchema );

module.exports = Repository;