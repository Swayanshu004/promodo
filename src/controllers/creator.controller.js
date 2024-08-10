import {Creator} from "../models/creator.model.js"

const registerCreator = async(req, res)=>{
    const {name , email, socialURl1, socialURL2, phone, categrory, password} = req.body;
    if([name, email, socialURl1, categrory, password].some((field)=> field?.trim() === "")){
        throw new ApiError(400, "Please fill the required field ! !");
    }
    const existedUser = await User.findOne({
        $or: [{ email }]
    })
    if(existedUser){
        res.status(500).send("User with email already exists");
    }
    const creator = await Creator.create({
        name,
        email,
        socialURl1,
        socialURL2,
        phone,
        categrory,
        password
    })
    const createdCreator = await Creator.findById(creator._id).select(
        "-password"
    )
    if(!createdCreator){
        res.status(500).send("somthing went wrong while register");
    }
    return res.status(200).json(createdCreator);
}
const loginCreator = async(req,res)=>{
    const {email, password} = req.body;
    const creator = await Creator.findOne({
        $or: [{email}]
    })
    if(!creator){
        res.status(400),send("creator not found ! !")
    }
    const checkPassword = await Creator.isPasswordCorrect(password)
    if(!checkPassword){
        res.status(400),send("Password Incorrect ! !")
    }
    res.status(200).send("logedIn")
}

export {
    registerCreator,
    loginCreator
}