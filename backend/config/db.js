import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log("Connection to DB successful...")
    } catch (error) {
        console.log("Could not connect to mongoDB...")
        console.log(`Error: ${error.message}`)
        process.exit(1)
    }
}

export default connectDB