import express from 'express';
import { foreignUser, domesticUser } from '../models/tourist.model.js';

const router = express.Router();

// Endpoint to fetch all tourists
router.get('/total-tourist', async (req, res) => {
  try {
    const foreignTourists = await foreignUser.find({});
    const domesticTourists = await domesticUser.find({});
    res.status(200).json({
      foreignTourists,
      domesticTourists
    });
  } catch (error) {
    console.error("Error fetching tourists:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to update location for a tourist by ID
router.post('/update-location/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { lat, lng } = req.body;

    if (lat == null || lng == null) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    // Try updating in foreignUser collection first
    let tourist = await foreignUser.findByIdAndUpdate(
      id,
      { location: { lat, lng } },
      { new: true }
    );

    // If not found, try updating in domesticUser collection
    if (!tourist) {
      tourist = await domesticUser.findByIdAndUpdate(
        id,
        { location: { lat, lng } },
        { new: true }
      );
    }

    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    res.status(200).json({
      message: 'Location updated',
      location: tourist.location
    });
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
