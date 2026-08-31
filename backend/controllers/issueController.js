const mongoose = require('mongoose');
const Repository = require('../models/repoModel');
const User = require('../models/userModel');
const Issue = require('../models/issueModel');


// CREATE ISSUE
async function createIssue(req, res) {
    const { title, description } = req.body;
    const id = req.params.id || req.body.id || req.body.repository;

    try {

        if (!title || !description) {
            return res.status(400).json({
                message: "Title and description are required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid Repository ID"
            });
        }

        const repository = await Repository.findById(id);

        if (!repository) {
            return res.status(404).json({
                message: "Repository not found"
            });
        }

        const issue = new Issue({
            title,
            description,
            repository: new mongoose.Types.ObjectId(id)
        });

        const result = await issue.save();

        // Repository ke issues array me issue add karo
        repository.issues.push(result._id);
        await repository.save();

        res.status(201).json({
            message: "Issue created successfully!",
            issue: result
        });

    } catch (error) {
        console.error("Error during issue creation:", error.message);

        res.status(500).json({
            message: "Server Error"
        });
    }
}


// UPDATE ISSUE
async function updateIssueByID(req, res) {
    const { id } = req.params;
    const { title, description, status } = req.body;

    try {

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid Issue ID"
            });
        }

        const issue = await Issue.findById(id);

        if (!issue) {
            return res.status(404).json({
                message: "Issue not found"
            });
        }

        if (title !== undefined) {
            issue.title = title;
        }

        if (description !== undefined) {
            issue.description = description;
        }

        if (status !== undefined) {
            issue.status = status;
        }

        const updatedIssue = await issue.save();

        res.json({
            message: "Issue updated successfully!",
            issue: updatedIssue
        });

    } catch (error) {
        console.error("Error during issue updating:", error.message);

        res.status(500).json({
            message: "Server Error"
        });
    }
}


// DELETE ISSUE
async function deleteIssueById(req, res) {
    const { id } = req.params;

    try {

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid Issue ID"
            });
        }

        const issue = await Issue.findByIdAndDelete(id);

        if (!issue) {
            return res.status(404).json({
                message: "Issue not found"
            });
        }

        await Repository.findByIdAndUpdate(
            issue.repository,
            {
                $pull: {
                    issues: issue._id
                }
            }
        );

        res.json({
            message: "Issue deleted successfully!"
        });

    } catch (error) {
        console.error("Error during issue deletion:", error.message);

        res.status(500).json({
            message: "Server Error"
        });
    }
}


// GET ALL ISSUES
async function getAllIssues(req, res) {

    try {

        const issues = await Issue
            .find({})
            .populate("repository");

        res.json(issues);

    } catch (error) {
        console.error("Error during issue fetching:", error.message);

        res.status(500).json({
            message: "Server Error"
        });
    }
}


// GET ISSUE BY ID
async function getIssueById(req, res) {
    const { id } = req.params;

    try {

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid Issue ID"
            });
        }

        const issue = await Issue
            .findById(id)
            .populate("repository");

        if (!issue) {
            return res.status(404).json({
                message: "Issue not found"
            });
        }

        res.json(issue);

    } catch (error) {
        console.error("Error during issue fetching:", error.message);

        res.status(500).json({
            message: "Server Error"
        });
    }
}


// ADD COMMENT TO ISSUE
async function commentOnIssue(req, res) {
    const { id } = req.params;
    const { text, user, username } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Issue ID" });
        }
        if (!text) {
            return res.status(400).json({ message: "Comment text is required" });
        }

        const issue = await Issue.findById(id);
        if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
        }

        if (!issue.comments) issue.comments = [];
        issue.comments.push({
            user: user && mongoose.Types.ObjectId.isValid(user) ? new mongoose.Types.ObjectId(user) : undefined,
            username: username || "User",
            text,
            createdAt: new Date()
        });

        const updated = await issue.save();
        res.json({ message: "Comment added successfully!", issue: updated });
    } catch (error) {
        console.error("Error adding comment to issue:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
}


module.exports = {
    createIssue,
    updateIssueByID,
    deleteIssueById,
    getAllIssues,
    getIssueById,
    commentOnIssue
};