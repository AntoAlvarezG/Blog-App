const express = require("express");
const app = express(); 
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("../src/routes/auth");
const userRoutes = require("../src/routes/users");
const postRoutes = require("../src/routes/posts");

// middlewares
app.use(express.json());
app.use(helmet());
app.use(cors());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// connect to db
mongoose.connect(process.env.MONGODB_URI)
.then( () => console.log('Connected to MongoDB'))
.catch( (err) => console.log(err));

// start server
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})