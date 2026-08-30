const express = require('express')
const repoController = require('../controllers/repoController');

const repoRouter =  express.Router();


repoRouter.post("/repo/create" , repoController.createRepository);
repoRouter.get("/repo/all" , repoController.getAllRepositries);
repoRouter.get("/repo/:id" , repoController.fetchRepositoryByID);
repoRouter.get("/repo/:name" , repoController.fetchRepositoryByName);
repoRouter.get("/repo/:userID" , repoController.fetchRepositoryForCurrentUser);
repoRouter.put("/repo/update/:id" , repoController.updateRepositoryById);
repoRouter.delete("/repo/delte/:id" , repoController.toggleVisibilityById);
repoRouter.patch("/repo/toggle/:id" , repoController.deleteRepositoryById);

module.exports = repoRouter;