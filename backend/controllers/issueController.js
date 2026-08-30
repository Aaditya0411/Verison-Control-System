const createIssue = (req , res ) => { 
    res.send("Issue created");
};

const updateIssueByID= (req , res) => {
    res.send("Issue Details are Fetched");
}

const deleteIssueById= (req , res) => {
    res.send("Issue Deleted !");
}

const getAllIssues= (req , res) => {
    res.send("All Issue Fetched");
}

const getIssueById= (req , res) => {
    res.send("Issue details fetched");
}




module.exports = {
    createIssue ,
    updateIssueByID ,
    deleteIssueById ,
    getAllIssues,
    getIssueById, 
    
}
