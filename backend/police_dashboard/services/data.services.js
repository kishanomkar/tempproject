import { foreignUser, domesticUser } from "../../tourist_dashboard/models/user.model.js";

export const getAllTourists = async () => {
    try {
        const foreignTourists = await foreignUser.find().select('-password');
        const domesticTourists = await domesticUser.find().select('-password');
        return { foreignTourists, domesticTourists };
    } catch (error) {
        console.error("Error fetching tourists:", error);
        throw error; // propagate error to be handled by the route
    }
};