const mongoose =require('mongoose');

const userSchema=new mongoose.Schema({
 name:{type:String,required:true},

 email:{type:String , required:true,unique:true},
 
 password:{type:String,required:true},

 role:{type:String,enum:["user","admin"],default:"user"},

 createdAt: { type: Date, default: Date.now } ,

   isActive: { type: Boolean, default: true },

   phoneNumber:{type:String,required:true},
address: {
  city: { type: String, default: "" },
  street: { type: String, default: "" },
  building: { type: String, default: "" }
}
})
module.exports = mongoose.model('User', userSchema);