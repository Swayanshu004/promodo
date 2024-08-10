import {Brand} from "../models/brand.model.js"

const registerBrand = async(req, res)=>{
    const {name , email, socialURl, categrory, password} = req.body;
    if([name, email, socialURl, categrory, password].some((field)=> field?.trim() === "")){
        res.status(400).send("Please fill the required field ! !");
    }
    const existedUser = await User.findOne({
        $or: [{ email }]
    })
    if(existedUser){
        res.status(500).send("Brand with email already exists");
    }
    const brand = await Brnad.create({
        name,
        email,
        socialURl,
        categrory,
        password
    })
    const createdBrand = await Brand.findById(brand._id).select(
        "-password"
    )
    if(!createdBrand){
        res.status(500).send("somthing went wrong while register");
    }
    return res.status(200).json(createdBrand);
}
const loginBrand = async(req,res)=>{
    const {email, password} = req.body;
    const brand = await Brand.findOne({
        $or: [{email}]
    })
    if(!brand){
        res.status(400),send("brand not found ! !")
    }
    const checkPassword = await Brand.isPasswordCorrect(password)
    if(!checkPassword){
        res.status(400),send("Password Incorrect ! !")
    }
    res.status(200).send("logedIn")
}

export {
    registerBrand,
    loginBrand
}