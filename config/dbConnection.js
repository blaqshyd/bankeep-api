import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.CONNECTION_STRING, {
            // Adding some connection options for better stability
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(
            'Database connected:',
            connect.connection.host,
            connect.connection.name
        );
    } catch (err) {
        console.error('Database connection error:', err.message);
        process.exit(1);
    }
};

export default connectDb;

