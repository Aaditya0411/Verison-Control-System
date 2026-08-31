const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const dns = require('dns');
const mainRouter = require('./routes/main.router.js')
const userRouter = require('./routes/user.router.js')

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();

const yargs = require("yargs");
const { hideBin } = require('yargs/helpers');

const { initRepo } = require('./controllers/init.js');
const { addRepo } = require('./controllers/add.js');
const { pushRepo } = require('./controllers/push.js');
const { pullRepo } = require('./controllers/pull.js');
const { commitRepo } = require('./controllers/commit.js');
const { revertRepo } = require('./controllers/revert.js');
const { log } = require('console');


yargs(hideBin(process.argv))
    .command(
        "start",
        "Start a new Server",
        {},
        startServer
    )
    .command(
        "init",
        "Initialise a new repository",
        {},
        initRepo
    )

    .command(
        "add <file>",
        "Add a file to the repository",
        (yargs) => {
            yargs.positional("file",
                {
                    describe: "File to add to the staging area ",
                    type: "string"
                })
        },
        (argv) => {
            addRepo(argv.file);
        }
    )
    .command(
        "push <remote> <branch>",
        "Push commits to a remote repository",
        (yargs) => {
            yargs.positional("remote", {
                describe: "Remote repository name",
                type: "string"
            }).positional("branch", {
                describe: "Branch to push",
                type: "string"
            })
        },
        pushRepo
    )
    .command(
        "pull <remote> <branch>",
        "Pull changes from a remote repository",
        (yargs) => {
            yargs.positional("remote", {
                describe: "Remote repository name",
                type: "string"
            }).positional("branch", {
                describe: "Branch to push",
                type: "string"
            })
        },
        pullRepo
    )
    .command(
        "commit <message>",
        "Commit stage changes file",
        (yargs) => {
            yargs.positional(
                "message", {
                describe: "Commit message",
                type: "string"
            }
            )
        },
        (argv) => {
            commitRepo(argv.message);
        }
    )
    .command(
        "revert <commitID>",
        "Revert a commit",
        (yargs) => {
            yargs.positional("commitID", {
                describe: "Commit to revert",
                type: "string"
            });
        },
        (argv) => {
            revertRepo(argv.commitID);
        }
    )

    .demandCommand(1, " You need at least one command ").help().argv;

function startServer() {
    const app = express();
    const port = process.env.PORT || 3002;

    app.use(bodyParser.json());
    app.use(express.json());

    const mongoURI = process.env.MONGODB_URI;


    mongoose
        .connect(mongoURI, {
            dbName: "VersionControlSystem"
        })
        .then(() => console.log("MongoDB connected !"))
        .catch((err) => console.error("Unable to connect : ", err));
        
    app.use(cors({ origin: "*" }));

    app.use("/", mainRouter);



    let user = "test";
    const httpServer = http.createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        },
    });

    io.on("connection", (socket) => {
        socket.on("joinRoom", (userID) => {
            user = userID;
            console.log("====");
            console.log(user);
            console.log("====");
            socket.join(userID);
        });
    });

    const db = mongoose.connection;
    db.once("open", async () => {
        console.log("CRUD operation called");
        // CRUD operations

    })

    httpServer.listen(port, () => {
        console.log(`Server is Listening on Port ${port}`);
    });


}