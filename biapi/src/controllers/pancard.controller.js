import Pancard from "../models/pancard.model.js";
import leadsModel from "../models/lead.model.js";

export const getAllPancards = async (req, res) => {
    try {
        const pancards = await Pancard.getAll();

        return res.status(200).json({
            success: true,
            message: "Pancards retrieved successfully",
            data: pancards
        });
    } catch (error) {
        console.error("Get All Pancards Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve pancards",
            error: error.message
        });
    }
};

export const getPancardById = async (req, res) => {
    try {
        const { id } = req.params;
        const pancard = await Pancard.getById(id);
        res.status(200).json({
            success: true,
            message: "Pancard retrieved successfully",
            data: pancard??'NA'
        });
    }catch (error) {
        console.error("Get Pancard By ID Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve pancard",
            error: error.message
        });
    }
};

export const pancardCreate = async (req, res) => {
    try {
        const pancardData = req.body;
        // 1. Create Pancard
        const pancard = await Pancard.create(pancardData);
        if (!pancard) {
            return res.status(400).json({success: false,message: "Failed to create pancard"});
        }

        // 2. Create a lead for every new pancard
        const leadData = await leadsModel.createCustomerLead({
            lead_type: "pancard",
            lead_unique_id: pancard.id,
            name: pancard.name,
            email: pancard.email,
            mobile: pancard.mobile,
            address: pancard.address,
            meta: {
                pancard_id: pancard.id,
                pan_type: pancard.pan_type,
                pan_number: pancard.pan_number,
                sponsor_id: pancard.sponsor_id,
                ref_code: pancard.ref_code
            }
        });

        // 3. Return response
        return res.status(201).json({success: true,message: "Pancard created successfully",data: {...pancard,leadData}});

    } catch (error) {
        console.error("Create Pancard Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create pancard",
            error: error.message
        });
    }
};


export const pancardUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPancard = await Pancard.update(id, req.body);  
        res.status(200).json({
            success: true,
            message: "Pancard updated successfully",
            data: updatedPancard
        });
    } catch (error) {
        console.error("Update Pancard Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update pancard",
            error: error.message
        });
    }
};

export const deletePancard = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Pancard.delete(id);    
        res.status(200).json({
            success: true,
            message: "Pancard deleted successfully",
            data: result
        });
    }catch (error) {
        console.error("Delete Pancard Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete pancard",
            error: error.message
        });
    }
}

export default { pancardCreate, getAllPancards, deletePancard, getPancardById, pancardUpdate };