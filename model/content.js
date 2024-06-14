import mongoose from "mongoose";

const Content = mongoose.model('Content' , {
  userId : {type : mongoose.Schema.Types.ObjectId , required : true},
  username : {type : String , required : true},
  imageData : {type : Buffer , required : true},
  imageContentType : {type : String , required : true},
  videoData: {type : Buffer , required : true},
  videoContentType : {type : String , required : true},
  title : {type : String , required : true},
  description: {type : String , required : true},
  likes : {type : Number , default : 0},
  dislikes : {type : Number , default : 0},
  views : {type : Number , default : 0}
});

export default Content