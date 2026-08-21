import db from "../config/db.js";
// import bcrypt from "bcryptjs";

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

export const getViewSliders = async (req, res) => {
     try{
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({success: false,message: "ID is required"});
        }
        const [result] =   await db.query("SELECT id, type, title, sub_title, description, image, url FROM sliders WHERE id = ? AND status = 'active'", [id]);
        if (result.length === 0) {
            return res.status(200).json({success: true,message: "No Slider Found...",data: []});
        }else{
            return res.status(200).json({ success: true, message: 'View The Slider Successfully...', data: result })
        }
    }catch(err){
        return res.status(500).json({ success: false, message: "Something went wrong", error: err.message });   
    }
};

export const createSliders = async (req, res) => {
    try{
        const {type,title,sub_title,description,image,url} = req.body;
        const [result] = await db.query("INSERT INTO sliders (type, title, sub_title, description, image, url) VALUES (?, ?, ?, ?, ?, ?)", [type,title,sub_title,description,image,url]);
        return res.status(200).json({ success: true, message: 'Created Slider Successfully...', data: {id: result.insertId} });
    }catch(err){
        return res.status(500).json({ success: false, message: "Something went wrong", error: err.message });   
    }
}

export const updateSliders = async (req, res) => {
    try{
        const { id } = req.params;
        const {type,title,sub_title,description,image,url} = req.body;

        if (!id) {
            return res.status(400).json({success: false,message: "ID is required"});
        }
        const [check] = await db.query("SELECT id FROM sliders WHERE id = ? AND status = 'active'", [id]);
        if (!check) {
            return res.status(404).json({success: false,message: "Slider not found"});
        }
        const [result] = await db.query("UPDATE sliders SET type = ?, title = ?, sub_title = ?, description = ?, image = ?, url = ? WHERE id = ?", [type,title,sub_title,description,image,url,id]);
        return res.status(200).json({ success: true, message: 'Updated Slider Successfully...', data: {id} });
    }catch(err){
        return res.status(500).json({ success: false, message: "Something went wrong", error: err.message });   
    }
}

export const deleteSliders = async (req, res) => {
     try{
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({success: false,message: "ID is required"});
        }
        const [result] = await db.query("DELETE FROM sliders WHERE id = ?", [id]);
        return res.status(200).json({ success: true, message: 'Deleted Slider Successfully...'});
    }catch(err){
        return res.status(500).json({ success: false, message: "Something went wrong", error: err.message });   
    }
}

