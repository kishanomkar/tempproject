import { foreignUser,domesticUser } from "../models/user.model.js";

export const registerForeignTourist = async({
    fullname,gender,date_of_birth,nationality,passportNumber,visaNumber,email,phoneNumber,arrivalDate,departureDate,flightNumber,destination,password,smartTouristId
})=>{
    if(!fullname || !gender || !date_of_birth || !nationality || !passportNumber || !visaNumber || !email || !phoneNumber || !arrivalDate || !departureDate || !flightNumber|| !destination || !password || !smartTouristId) {
        throw new Error("All fields are required");
    }
    const hashPassword = await foreignUser.hashPassword(password);

    const newForeignTourist = await foreignUser.create({
        fullname,
        gender,
        date_of_birth,
        nationality,
        passportNumber,
        visaNumber,
        email,
        phoneNumber,
        arrivalDate,
        departureDate,
        flightNumber,
        destination,
        password: hashPassword,
        smartTouristId
    });

    return newForeignTourist;
}


export const registerDomesticTourist = async({
    fullname,gender,date_of_birth,nationality,aadharNumber,drivingLicenseNumber,email,phoneNumber,arrivalDate,departureDate,flightNumber,destination,password,smartTouristId
})=>{
    if(!fullname || !gender || !date_of_birth || !nationality || !aadharNumber || !email || !phoneNumber || !arrivalDate || !departureDate  || !destination || !password || !smartTouristId) {
        throw new Error("All fields are required");
    }
    const hashPassword = await domesticUser.hashPassword(password);

    const newDomesticTourist = await domesticUser.create({
        fullname,
        gender,
        date_of_birth,
        nationality,
        aadharNumber,
        drivingLicenseNumber,
        email,
        phoneNumber,
        arrivalDate,
        departureDate,
        flightNumber,
        destination,
        password: hashPassword,
        smartTouristId
    });

    return newDomesticTourist;
}