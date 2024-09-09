const express = require('express');
const connectDb = require('./config/dbConnection');
const dotenv = require("dotenv").config();
connectDb();
const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.get("/index.js", (req, res) => res.type('html').send(''));
app.use("/api/users", require("./routes/authRoute"));
app.listen(port, ()=> console.log(`server running at port ${port}`));

