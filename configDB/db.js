import mongoose from "mongoose";

const connecToDB = async () => {
    try{
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${connection.connection.host}`);
    }

    catch (err)
    {
        console.log(`Error: ${err.message}`);
        process.exit(1);
    }
}

export default connecToDB