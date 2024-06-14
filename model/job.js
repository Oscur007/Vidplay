import mongoose from "mongoose";

const ApplicationSchema = mongoose.Schema({
    name : {type : String , required : true},
    age : {type : Number , required : true},
    address : {type : String , required : true},
    country : {type : String , required : true},
    phoneNumber : {type : String , required : true},
    email : {type : String , required : true},
    resume : {type : Buffer , required : true}
})

const Application = mongoose.model('Application', ApplicationSchema);

const Job = mongoose.model('Job' , {
    user : {type : String , required : true},
    title : {type : String , required : true},
    description : {type : String , required : true},
    jobType : {type : String , required : true},
    salary : {type : Number , required : true},
    experience : {type : Number , required : true},
    workMode : {type : String , required : true},
    location : {type : String , required : false},
    email : {type : String , required : true},
    applications : [ApplicationSchema],
});

export { Job , Application };