const fs  = require('fs').promises;
const { log } = require('console');
const path =  require("path");

async function initRepo(){
    const repoPath  = path.resolve(process.cwd() , "mygit");
    const commitsPath = path.join(repoPath , "commits");

    try {
        await fs.mkdir(repoPath , { recursive: true });
        await fs.mkdir(commitsPath , { recursive: true });
        await fs.writeFile(path.join(repoPath , "config.json") , JSON.stringify({ bucket :  process.env.S3_BUCKET}));
        console.log("Repository initialised and created! ");
        
        
    } catch (error) {
        console.error( " Error intialising repository " , error);
        
    }
    
}

module.exports = { initRepo };