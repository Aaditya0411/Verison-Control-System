const createRepository = (req , res ) => { 
    res.send("Repository created");
};

const getAllRepositries= (req , res) => {
    res.send("All repositories Fetched");
}

const fetchRepositoryByID= (req , res) => {
    res.send("Repository Details are Fetched");
}

const fetchRepositoryByName= (req , res) => {
    res.send("Repository Details are fetched !!!");
}

const fetchRepositoryForCurrentUser= (req , res) => {
    res.send("Repository for Logged in User Fetched");
}

const updateRepositoryById= (req , res) => {
    res.send("Repository updated!");
}

const toggleVisibilityById= (req , res) => {
    res.send("Visibility Toggled ! ");
}

const deleteRepositoryById= (req , res) => {
    res.send("Repository Deleted !");
}

module.exports = {
    createRepository ,
    getAllRepositries ,
    fetchRepositoryByID ,
    fetchRepositoryByName,
    fetchRepositoryForCurrentUser, 
    updateRepositoryById ,
    toggleVisibilityById ,
    deleteRepositoryById

}
