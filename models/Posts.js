const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    //connect to specific user
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    text: {
        type: String,
        required: true,
    },
    //name of user
    name: {
        type: String,
    },
    avatar: {
        type: String
    },
    likes: [
        //each like is an object, one of the properties will be the user who liked it, that way, we can make sure a
        // user can only like a post once.
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            }
        }
    ],
    comments: [
        {
            users: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            },
            text: {
                type: String,
                required: true
            },
            name: {
                type: String
            },
            avatar: {
                type: String
            },
            date: {
                type: String,
                default: Date.now
            }
            
        }
    ],
    date: {
        type: String,
        default: Date.now
    }
});

module.exports = Post = mongoose.model('post', PostSchema)