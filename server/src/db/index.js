import mongoose from 'mongoose';
import { DB_NAME } from '../contants.js';

const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB}/${DB_NAME}`)
        // console.log(connectionInstance);
        console.log(`\nMongoDb connected !! DB HOST : ${connectionInstance.connection.host}`);
    } catch (err){
        console.log("Error in DB connection",err)
        process.exit(1)
    }
}

export default connectDB;