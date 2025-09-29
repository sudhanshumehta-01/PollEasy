const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors())

mongoose.connect('mongodb://localhost:27017/pollEasy_db').
    then(() => { console.log("Mongo db connected") }).
    catch((err) => { console.log("error in connection", err) });

const authRoutes = require("./routes/authRoutes");
const pollRoutes = require("./routes/pollRoutes");
const voteRoutes = require("./routes/voteRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use('/auth', authRoutes);
app.use("/polls", pollRoutes);
app.use("/votes", voteRoutes);
app.use("/admin", adminRoutes);

app.listen(5000, () => { console.log("server started") });
