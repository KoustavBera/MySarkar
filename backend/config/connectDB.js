import mongoose from "mongoose";

const connectDB = async () => {
	try {
		// console.log("GHI",`${process.env.MONGODB_URI}${process.env.DB_NAME}`);
		const connectionInstance = await mongoose.connect(
			`${process.env.MONGODB_URI}/${process.env.DB_NAME}`
		);
		// console.log("hgiji",connectionInstance)
		console.log(
			"Database connected successfully: ",
			connectionInstance.connection.host
		);
	} catch (error) {
		console.log("db error", error.message);
	}
};

export default connectDB;
