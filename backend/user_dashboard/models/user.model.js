import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();    

const foreignUserSchema = new mongoose.Schema({
userId:{
    type: String,
    required: true
},
fullname:{
    type: String,
    required: true
},
gender:{
    type: String,
    required: true
},
date_of_birth:{
    type: Date,
    required: true
},
nationality:{
    type: String,
    required: true
},
identityDocument:{
    passportNumber:{
        type: String,
        required: true,
        unique: true
    },
    visaNumber:{
        type: String,
        required: true,
        unique: true
    },

},
contactInformation:{
    email:{
        type: String,
        required: true,
    },
    phoneNumber:{
        type: String,
    }

},
travelDetails:{
    arrivalDate:{
        type: Date,
        required: true
    },
    departureDate:{
        type: Date,
        required: true
    },
    flightNumber:{
        type: String,
        required: true
    },
    originCountry:{
        type: String,
        required: true
    },
    destination:{
        type: String,
        required: true
    }

},
password:{
    type: String,
    required: true
},
smartTouristId:{
    type: String,
    required: true,
    unique: true
}


}, {timestamps:true});

const domesticUserSchema = new mongoose.Schema({
    userId:{
    type: String,
    required: true
},
fullname:{
    type: String,
    required: true
},
gender:{
    type: String,
    required: true
},
date_of_birth:{
    type: Date,
    required: true
},
nationality:{
    type: String,
    required: true
},
identityDocument:{
    aadharNumber:{
        type: String,
        required: true,
        unique: true
    },
    drivingLicenseNumber:{
        type: String,
        
        unique: true
    },
},
contactInformation:{
    email:{
        type: String,
        required: true,
    },
    phoneNumber:{
        type: String,
    }

},
travelDetails:{
    arrivalDate:{
        type: Date,
        required: true
    },
    departureDate:{
        type: Date,
        
    },
    flightNumber:{
        type: String,
        
    },
    
    destination:{
        type: String,
        required: true
    }

},
password:{
    type: String,
    required: true
},
smartTouristId:{
    type: String,
    required: true,
    unique: true
}


}, {timestamps:true});

export const foreignUser = mongoose.model('ForeignUser', foreignUserSchema);
export const domesticUser = mongoose.model('DomesticUser', domesticUserSchema);



