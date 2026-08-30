const getAllUsers = ( req , res) =>{
    res.send("All users fetched!");
}

const signup = (req , res) => {
    res.send("Signing Up")
}
const Login = (req , res) => {
    res.send("Logining in!")
}
const getUserProfile = (req , res) => {
    res.send("Profile Fetched ")
}
const updateUserProfile = (req , res) => {
    res.send("Profile updated ")
}
const deleteUserProfile = (req , res) => {
    res.send("Profile Deleted ")
}


module.exports = {
    getAllUsers ,
    signup ,
    Login ,
    getUserProfile ,
    updateUserProfile ,
    deleteUserProfile
}