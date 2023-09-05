const mongoose=require('mongoose');
const mongoURI="mongodb://127.0.0.1:27017/inotes?directConnection=true";
const connectToMongo=()=>{
    mongoose.connect(mongoURI).then(()=>{
        console.log("connected to mongo");
    }).catch((err)=>{
        console.log(err);
    })
   
}
module.exports=connectToMongo;
