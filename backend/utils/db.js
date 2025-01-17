import mongoose from "mongoose";
const connectDB = async ()=> {
    try{
        await mongoose.connect("mongodb+srv://sagarrv152:2ja4dFT7TOmIEzTY@internship.wrnob.mongodb.net/?retryWrites=true&w=majority&appName=internship");
        console.log("mongoDB connected successfully");
    }catch(error){
        console.log(error);
        
    }
}
export default connectDB;