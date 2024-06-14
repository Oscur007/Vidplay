import mongoose from "mongoose";

const User = mongoose.model('User' , {
    username : {type : String , required : true , unique : true , index : true , sparse : true},
    email : {type : String , required : true , unique : true , index : true , sparse : true},
    createdOn : {type : Date , required : true},
    password : {type : String , required : true},
    description : {type : String , default : ''},
    subscriber : {type : Number , default : 0},
    likedVideos : {type : [mongoose.Schema.Types.ObjectId]},
    dislikedVideos : {type : [mongoose.Schema.Types.ObjectId]},
    watchLater : {type : [mongoose.Schema.Types.ObjectId]},
    history : {type : [mongoose.Schema.Types.ObjectId]},
    myVideos : {type : [mongoose.Schema.Types.ObjectId]},
    subscribedChannels : {type : [mongoose.Schema.Types.ObjectId]},
    jobsPosted : {type : [mongoose.Schema.Types.ObjectId]},
    jobsApplied : {type : [mongoose.Schema.Types.ObjectId]}
})

export default User;