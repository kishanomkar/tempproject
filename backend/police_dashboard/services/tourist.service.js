import { foreignUser, domesticUser } from '../models/tourist.model.js';



export const registerForeignTourist = async ({
    fullname, gender, date_of_birth, nationality, identityDocument, contactInformation, travelDetails, password, smartTouristId
}) => {
    if (!fullname || !gender || !date_of_birth || !nationality || !identityDocument || !contactInformation || !travelDetails || !password || !smartTouristId) {
        throw new Error("All fields are required");
    }

    
    // You can add password hashing here if needed
    const newTourist = await foreignUser.create({
        fullname,
        gender,
        date_of_birth,
        nationality,
        identityDocument,
        contactInformation,
        travelDetails,
        password,
        smartTouristId
    });
    return newTourist;
};

export const registerDomesticTourist = async ({
    fullname, gender, date_of_birth, nationality, identityDocument, contactInformation, travelDetails, password, smartTouristId
}) => {
    if (!fullname || !gender || !date_of_birth || !nationality || !identityDocument || !contactInformation || !travelDetails || !password || !smartTouristId) {
        throw new Error("All fields are required");
    }
    // You can add password hashing here if needed
    const newTourist = await domesticUser.create({
        fullname,
        gender,
        date_of_birth,
        nationality,
        identityDocument,
        contactInformation,
        travelDetails,
        password,
        smartTouristId
    });
    return newTourist;
};
