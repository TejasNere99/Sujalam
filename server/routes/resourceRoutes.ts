import express from 'express';
import { resourceAvailabilityService } from '../services/resourceAvailabilityService';
import { resourceMatchingService } from '../services/resourceMatchingService';
import { FarmResourceRequest } from '../models/FarmResourceRequest';
import mongoose from 'mongoose';
import { appendEvent } from '../resilience/eventLogService';

const router = express.Router();

// Mock auth middleware for the hackathon
const authenticate = (req: any, res: any, next: any) => {
  req.user = { id: 'farmer-123' };
  next();
};

router.post('/search', authenticate, async (req, res) => {
  try {
    const { longitude, latitude, operation, requiredDate, requiredWorkers, requiredMachineType } = req.body;
    
    if (!longitude || !latitude || !operation || !requiredDate) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const matches = await resourceMatchingService.findMatches({
      longitude: Number(longitude),
      latitude: Number(latitude),
      operation,
      requiredDate: new Date(requiredDate),
      requiredWorkers: requiredWorkers ? Number(requiredWorkers) : undefined,
      requiredMachineType
    });

    res.json({ success: true, matches });
  } catch (error) {
    console.error('Resource search error:', error);
    res.status(500).json({ error: 'Internal server error during search' });
  }
});

router.post('/request', authenticate, async (req: any, res) => {
  try {
    const { farm_id, resource_type, requested_operation, requested_date, start_time, duration_hours, location, matched_resource_ids, estimated_cost } = req.body;

    const newRequest = new FarmResourceRequest({
      farm_id,
      farmer_id: req.user.id,
      resource_type,
      requested_operation,
      requested_date: new Date(requested_date),
      start_time,
      duration_hours,
      location,
      matched_resource_ids,
      estimated_cost,
      booking_status: 'PENDING'
    });

    await newRequest.save();
    
    // Log for blackout resilience
    await appendEvent(
      'RESOURCE_REQUEST_CREATED',
      'FarmResourceRequest',
      newRequest._id.toString(),
      farm_id,
      req.user.id,
      { request_id: newRequest._id, booking_status: 'PENDING' },
      'APPLIED'
    );

    res.json({ success: true, request: newRequest });
  } catch (error) {
    console.error('Resource request error:', error);
    res.status(500).json({ error: 'Internal server error during resource request' });
  }
});

router.post('/request/:id/confirm', authenticate, async (req: any, res) => {
  try {
    const request = await FarmResourceRequest.findOne({ _id: req.params.id, farmer_id: req.user.id });
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    request.booking_status = 'CONFIRMED';
    await request.save();

    await appendEvent(
      'RESOURCE_BOOKING_CONFIRMED',
      'FarmResourceRequest',
      request._id.toString(),
      request.farm_id.toString(),
      req.user.id,
      { request_id: request._id, booking_status: 'CONFIRMED' },
      'APPLIED'
    );

    res.json({ success: true, request });
  } catch (error) {
    console.error('Resource confirm error:', error);
    res.status(500).json({ error: 'Internal server error during booking confirmation' });
  }
});

export { router as resourceRoutes };
