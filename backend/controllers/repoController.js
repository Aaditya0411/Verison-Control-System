const mongoose = require('mongoose');
const Repository = require('../models/repoModel');
const User = require('../models/userModel');
const Issue = require('../models/issueModel');

async function createRepository(req, res) {

    const { owner, name, issues, content, description, visibility } = req.body;

    try {

        if (!name) {
            return res.status(400).json({ error: "Repository name is required" })
        }

        if (!mongoose.Types.ObjectId.isValid(owner)) {
            return res.status(400).json({ error: "Invalid User Id" })
        }

        // if(!mongoose.Types.ObjectId.isValid(issues)){
        //     return res.status(400).json({error : "Invalid User Id"})
        // }

        const newRepository = new Repository({
            owner: new mongoose.Types.ObjectId(owner),
            name,
            issues,
            content,
            description,
            visibility
        });

        const result = await newRepository.save();

        res.status(201).json({
            message: "Repository created!",
            repositoryID: result._id
        })

    } catch (error) {

        console.error("Error during repository creation :", error.message);
        res.status(500).json({ message: "Server Error" });

    }
};

async function getAllRepositries(req, res) {
    try {
        const repositories = await Repository
            .find({})
            .populate("owner")
            .populate("issues");

        res.json(repositories)

    } catch (error) {
        console.error("Error during repository creation :", error.message);
        res.status(500).json({ message: "Server Error" });

    }
}

async function fetchRepositoryByID(req, res) {

    const repoID = req.params.id;

    try {
        const repository = await Repository
            .findById(repoID)
            .populate("owner")
            .populate("issues");

        if (!repository) {
            return res.status(404).json({
                message: "Repository not found"
            });
        }

        res.json(repository);
    } catch (error) {
        console.error("Error during repository creation :", error.message);
        res.status(500).json({ message: "Server Error" });
    }
}

async function fetchRepositoryByName(req, res) {
    const repoName = req.params.name;

    try {
        const repository = await Repository
            .findOne({ name: repoName })
            .populate("owner")
            .populate("issues");

        if (!repository) {
            return res.status(404).json({
                message: "Repository not found"
            });
        }

        res.status(200).json(repository);

    } catch (error) {
        console.error("Error during repository fetching:", error.message);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

async function fetchRepositoryForCurrentUser(req, res) {
    const userId = req.params.userID || req.user;

    try {
        const repositories = await Repository.find({
            owner: userId
        });

        if (!repositories || repositories.length === 0) {
            return res.status(404).json({
                message: "Repository not found"
            });
        }

        res.json({
            message: " Repositories Found",
            repositories
        })

    } catch (error) {
        console.error("Error during repository fetching:", error.message);
        res.status(500).json({
            message: "Server Error"
        });
    }


}

async function updateRepositoryById(req, res) {
    const { id } = req.params;

    const { content, description } = req.body;

    try {

        const repository = await Repository.findById(id);

        if (!repository) {
            return res.status(404).json({
                message: "Repository not found"
            });
        }

        repository.content.push(content);
        repository.description = description;

        const updatedRepository = await repository.save();

        res.json({
            message: "Repository updated successfully!",
            repository: updatedRepository
        });
    } catch (error) {

        console.error("Error during repository updating:", error.message);
        res.status(500).json({
            message: "Server Error"
        });

    }


}

async function toggleVisibilityById(req, res) {
    const { id } = req.params;



    try {

        const repository = await Repository.findById(id);

        if (!repository) {
            return res.status(404).json({
                message: "Repository not found"
            });
        }

        repository.visibility = !repository.visibility;

        const updatedRepository = await repository.save();

        res.json({
            message: "Repository visibility toggled successfully!",
            repository: updatedRepository
        });
    } catch (error) {

        console.error("Error during repository  visibility toggling :", error.message);
        res.status(500).json({
            message: "Server Error"
        });

    }

}

async function deleteRepositoryById(req, res) {
    const { id } = req.params;

    try {

        const repository = await Repository.findByIdAndDelete(id);

        if (!repository) {
            return res.status(404).json({
                message: "Repository not found"
            });
        }

        res.json({
            message: "Repository deleted successfully!"
        });
    } catch (error) {
        console.error("Error during repository  visibility toggling :", error.message);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

module.exports = {
    createRepository,
    getAllRepositries,
    fetchRepositoryByID,
    fetchRepositoryByName,
    fetchRepositoryForCurrentUser,
    updateRepositoryById,
    toggleVisibilityById,
    deleteRepositoryById

}
