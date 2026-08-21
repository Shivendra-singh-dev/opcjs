import db from "../config/db.js";

export const getSliders = async (req, res) => {
    try {
        const [sliders] = await db.query(
            "SELECT id, type, title, sub_title, description, image, url FROM sliders WHERE status = 'active' ORDER BY id DESC"
        );

        if (sliders.length === 0) {
            return res.status(200).json({success: true,message: "No Slider Found...",data: []});
        }

        return res.status(200).json({success: true,message: "Slider List Successfully...",data: sliders});

    } catch (err) {
        return res.status(500).json({success: false,message: "Something went wrong",error: err.message});
    }
};

export const getDeals = async (req, res) => {
    try {
        const [deals] = await db.query(
            "SELECT id, type, title, sub_title, description, image, url FROM deals WHERE status = 'active' ORDER BY id DESC"
        );

        if (deals.length === 0) {
            return res.status(200).json({success: true,message: "No Deals Found...",data: []});
        }

        return res.status(200).json({success: true,message: "Deals List Successfully...",data: deals});

    } catch (err) {
        return res.status(500).json({success: false,message: "Something went wrong",error: err.message});
    }
};

export const getSocialmedia = async(req,res)=>{
    try{
        const [socialmedia] = await db.query("SELECT id, type, title, sub_title,url FROM socialmedia WHERE status = 'active' ORDER BY id DESC");
        if(socialmedia.length === 0){
            return res.status(200).json({success: true,message: "No Social Media Found...",data: []}); 
        }
        return res.status(200).json({success: true,message: "Social Media List Successfully...",data: socialmedia});
    }catch(err){
        return res.status(500).json({success: false,message: "Something went wrong",error: err.message});
    }
};

export const getPromotionads = async(req,res)=>{
    try{
        
        return res.status(200).json({success: true,message: "Deals List Successfully...",data: []});
    }catch(err){
        return res.status(500).json({success: false,message: "Something went wrong",error: err.message});
    }
};

export const getBigsell = async (req, res) => {
    try {
        const [bigsell] = await db.query(`SELECT id,category,title,description,image_url,url,price FROM bigsell WHERE status = 'active' ORDER BY id DESC `);

        if (bigsell.length === 0) {
            return res.status(404).json({success: false,message: "No Bigsell Found",data: []});
        }

        return res.status(200).json({success: true,message: "Bigsell List Successfully",data: bigsell});

    } catch (err) {
        return res.status(500).json({success: false,message: "Something went wrong",error: err.message});
    }
};
