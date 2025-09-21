import { foreignUser, domesticUser } from "../models/tourist.model.js";

export const getAllTourists = async () => {
    try {
        const foreignTourists = await foreignUser.find(); // fetch all foreign tourists
        const domesticTourists = await domesticUser.find(); // fetch all domestic tourists
        return { foreignTourists, domesticTourists };
    } catch (error) {
        console.error("Error fetching tourists:", error);
        throw error; // propagate error to be handled by the route
    }
};
