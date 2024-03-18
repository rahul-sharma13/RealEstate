import mongoose from 'mongoose';

const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(process.env.MONGODB)
        console.log(`\nMongoDb connected !! DB HOST : ${connectionInstance.connection.host}`);
    } catch (err){
        console.log("Error in DB connection",err)
        process.exit(1)
    }
}

export default connectDB;