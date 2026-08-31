const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { MongoClient, ReturnDocument } = require('mongodb');
const dotenv = require('dotenv');
const userRouter = require('../routes/user.router');
var ObjectId = require('mongodb').ObjectId;

dotenv.config();
const uri = process.env.MONGODB_URI;

let client;

async function connectClient() {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
    }
}


async function signup(req, res) {
    const { username, password, email } = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        await connectClient();
        const db = client.db("VersionControlSystem");
        const usersCollection = db.collection("users");

        const existingUser = await usersCollection.findOne({
            $or: [{ username }, { email }]
        });
        if (existingUser) {
            return res.status(400).json({ message: "Username or Email already exists!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            username,
            password: hashedPassword,
            email,
            repositories: [],
            followedUsers: [],
            starRepos: [],
        }

        const result = await usersCollection.insertOne(newUser);

        const token = jwt.sign({ id: result.insertedId }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        res.json({ token, userId: result.insertedId });
    } catch (err) {
        console.error("Error during SignUp : ", err.message);
        res.status(500).json({ message: "Server error during signup" });
    }
}

async function Login(req, res) {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required!" });
        }

        await connectClient();
        const db = client.db("VersionControlSystem");
        const usersCollection = db.collection("users");

        // Allow logging in with either email OR username
        const user = await usersCollection.findOne({
            $or: [{ email: email }, { username: email }]
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        res.json({ token, userId: user._id });

    } catch (error) {
        console.error("Error during login :", error.message);
        res.status(500).json({ message: "Server Error during login" });
    }
}

async function getAllUsers(req, res) {
    try {
        await connectClient();
        const db = client.db("VersionControlSystem");
        const usersCollection = db.collection("users");

        const users = await usersCollection.find({}).toArray();
        res.json(users)


    } catch (error) {
        console.error("Error during fetching :", error.message);
        res.status(500).send("Server Error");
    }
}


async function getUserProfile(req, res) {
    const currentID = req.params.id;

    try {
        await connectClient();

        if (!ObjectId.isValid(currentID)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const db = client.db("VersionControlSystem");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({
            _id: new ObjectId(currentID)
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }



        res.status(200).json({
            user,
            message: "Profile fetched!"
        });
    } catch (error) {
        console.error("Error during fetching:", error.message);
        res.status(500).send("Server Error");
    }

}

async function updateUserProfile(req, res) {
    const currentID = req.params.id;
    const { email, password } = req.body;

    try {
        await connectClient();

        if (!ObjectId.isValid(currentID)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const db = client.db("VersionControlSystem");
        const usersCollection = db.collection("users");

        let updateFields = {};

        if (email) {
            updateFields.email = email;
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            updateFields.password = hashedPassword;
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({
                message: "Nothing to update"
            });
        }

        const result = await usersCollection.updateOne(
            {
                _id: new ObjectId(currentID)
            },
            {
                $set: updateFields
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const updatedUser = await usersCollection.findOne(
            {
                _id: new ObjectId(currentID)
            },
            {
                projection: {
                    password: 0
                }
            }
        );

        res.status(200).json({
            message: "Profile updated successfully!",
            user: updatedUser
        });

    } catch (error) {
        console.error("Error during updating:", error.message);
        res.status(500).json({message: "Server Error"});
    }
}

async function deleteUserProfile(req, res) {
    const currentID = req.params.id;

    try {
        await connectClient();
        const db = client.db("VersionControlSystem");
        const usersCollection = db.collection("users");

        const result = await usersCollection.deleteOne({ _id: new ObjectId(currentID),})

        if (result.deletedCount == 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({message : " User profile deleted "});

    } catch (error) {
        console.error("Error during fetching:", error.message);
        res.status(500).send("Server Error");
    }
}


module.exports = {
    getAllUsers,
    signup,
    Login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
}