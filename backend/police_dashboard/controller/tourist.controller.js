import { validationResult } from 'express-validator';
import * as touristService from '../services/tourist.service.js';
import QRCode from 'qrcode';

// Shared QR data object
export const qrDataStore = {
  foreignQRData: null,
  domesticQRData: null,
};

export const registerForeignTouristController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const tourist = await touristService.registerForeignTourist(req.body);
    if (tourist && tourist._doc) delete tourist._doc.password;

    const qrcode = JSON.stringify({
      fullname: tourist.fullname,
      nationality: tourist.nationality,
      smartTouristId: tourist._id,
      passportNumber: tourist.identityDocument.passportNumber,
      visaNumber: tourist.identityDocument.visaNumber,
      arrivalDate: tourist.travelDetails.arrivalDate,
      departureDate: tourist.travelDetails.departureDate,
      flightNumber: tourist.travelDetails.flightNumber,
      originCountry: tourist.travelDetails.originCountry,
      destination: tourist.travelDetails.destination
    });

    const qrCodeImage = await QRCode.toDataURL(qrcode);

    // Store the QR data in the shared object
    qrDataStore.foreignQRData = qrCodeImage;

    res.status(200).json({
      tourist,
      qrcode: qrCodeImage
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const registerDomesticTouristController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const tourist = await touristService.registerDomesticTourist(req.body);
    if (tourist && tourist._doc) delete tourist._doc.password;

    const qrcode = JSON.stringify({
      fullname: tourist.fullname,
      nationality: tourist.nationality,
      smartTouristId: tourist._id,
      aadharNumber: tourist.identityDocument.aadharNumber,
      drivingLicenseNumber: tourist.identityDocument.drivingLicenseNumber,
      arrivalDate: tourist.travelDetails.arrivalDate,
      departureDate: tourist.travelDetails.departureDate,
      flightNumber: tourist.travelDetails.flightNumber,
      destination: tourist.travelDetails.destination
    });

    const qrCodeImage = await QRCode.toDataURL(qrcode);

    // Store the QR data in the shared object
    qrDataStore.domesticQRData =  qrCodeImage;

    res.status(200).json({
      tourist,
      qrcode: qrCodeImage
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};



