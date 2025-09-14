import Police from "../models/police.model.js";

export const registerPolice = async ({
    fullname, service_id, rank, phone_no, station, email, password, place_of_posting, district, state
}) => {
    if(!fullname || !service_id || !rank || !phone_no || !station || !email || !password || !place_of_posting || !district || !state){
        throw new Error("All fields are required");
    }

    const hashPassword = await Police.hashPassword(password);

    const newPolice = await Police.create({
        fullname,
        email,
        password:hashPassword,
        phone_no,
        service_id,
        rank,
        station,
        place_of_posting,
        district,
        state
    })

    return newPolice
}

