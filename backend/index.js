const yargs = require("yargs");
const { hideBin } = require('yargs/helpers');

const { initRepo } = require('./controllers/init.js');
const { addRepo } = require('./controllers/add.js');
const { pushRepo } = require('./controllers/push.js');
const { pullRepo } = require('./controllers/pull.js');
const { commitRepo } = require('./controllers/commit.js');
const { revertRepo } = require('./controllers/revert.js');


yargs(hideBin(process.argv))
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
        addRepo
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
        "Commit stage changes",
        (yargs) => {
            yargs.positional(
                "message", {
                describe: "Commit message",
                type: "string"
            }
            )
        },
        commitRepo
    )
    .command(
        "revert <commit>",
        "Revert a commit",
        (yargs) => {
            yargs.positional("commit", {
                describe: "Commit to revert",
                type: "string"
            });
        },
        revertRepo
    )

    .demandCommand(1, " You need at least one command ").help().argv;
