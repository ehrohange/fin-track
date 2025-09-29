import { errorHandler } from "../utils/error.js";
import Report from "../Models/Report.js";

export const createReport = async (req, res, next) => {
    const { header, details } = req.body;
    try {
        if (!header || !details) {
            return next(errorHandler(400, "Header and details are required."));
        }
        const report = await Report.create({
            header,
            details
        });

        res.status(201).json({message: "Report submitted successfully!", report});
    } catch (error) {
        next(error);
    }
}