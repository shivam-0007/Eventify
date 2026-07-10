const express=require("express");
const dotenv=require("dotenv");
const cors=require("cors");
const mongoose=require("mongoose");
const authRoutes=require("./routes/auth.js");
const eventRoutes=require("./routes/events.js");
const bookingRoutes=require("./routes/booking.js");

dotenv.config();

const app=express();
app.use(cors());
app.use(express.json());

//routes
app.use('/api/auth',authRoutes);
app.use('/api/events',eventRoutes);
app.use('/api/bookings',bookingRoutes);

//connect to mongodb
// console.log('Connecting to MongoDB:', process.env.MONGODB_URI?.substring(0, 50) + '...');

mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log("MongoDB connected successfully");
}).catch((err)=>{
    console.error('MongoDB Connection Error:',err);
    
}); 

const port=process.env.PORT || 5001;
app.listen(port,()=>{   
    console.log(`Server is running on port ${port}`);
});