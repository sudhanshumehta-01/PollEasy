const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors())

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/pollEasy_db";

const authRoutes = require("./routes/authRoutes");
const pollRoutes = require("./routes/pollRoutes");
const voteRoutes = require("./routes/voteRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use('/auth', authRoutes);
app.use("/polls", pollRoutes);
app.use("/votes", voteRoutes);
app.use("/admin", adminRoutes);

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("Mongo db connected");
        app.listen(PORT, () => { console.log(`server started on port ${PORT}`) });
    })
    .catch((err) => {
        console.error("error in connection", err);
        process.exit(1);
    });
