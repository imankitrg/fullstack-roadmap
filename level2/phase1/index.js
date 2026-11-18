
require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db.js");
const redis = require("./config/redis.js");
const User = require("./models/user.model.js");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Hello from level 2 phase 1"
    });
});


const CACHE_KEY = "users";
const CACHE_TTL = 60;

// POST - Create User
app.post("/create", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await User.create({
            name,
            email,
            password
        });

        // Update Redis cache if it already exists
        const cachedUsers = await redis.get(CACHE_KEY);

        if (cachedUsers) {
            const users = JSON.parse(cachedUsers);

            users.push(user);

            await redis.setex(
                CACHE_KEY,
                CACHE_TTL,
                JSON.stringify(users)
            );
        }

        res.status(201).json({
            message: "User created successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


// GET - Fetch Users with Redis Cache
app.get("/get", async (req, res) => {
    try {
        // Check Redis first
        const cachedUsers = await redis.get(CACHE_KEY);

        if (cachedUsers) {
            console.log("Cache HIT");

            return res.status(200).json({
                message: "Users fetched from Redis",
                source: "Redis Cache",
                users: JSON.parse(cachedUsers)
            });
        }

        // Cache MISS - Fetch from MongoDB
        console.log("Cache MISS");

        const users = await User.find().select("-password").lean();

        // Store data in Redis with 60 seconds expiry
        await redis.setex(
            CACHE_KEY,
            CACHE_TTL,
            JSON.stringify(users)
        );

        res.status(200).json({
            message: "Users fetched from MongoDB",
            source: "MongoDB",
            users
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});



// Start server
const startServer = async () => {
    try {
        await connectDB();

        await redis.ping();
        console.log("Redis connected successfully");

        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();
