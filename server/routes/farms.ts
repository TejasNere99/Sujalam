import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import * as farmService from '../services/farmService';
import * as cropService from '../services/cropService';
import * as soilService from '../services/soilService';
import * as weatherService from '../services/weatherService';
import * as cropHealthService from '../services/cropHealthService';
import * as marketService from '../services/marketService';
import * as fpoService from '../services/fpoService';
import * as schemeService from '../services/schemeService';
import * as advisoryService from '../services/advisoryService';

const router = Router();
router.use(authenticate);

// FPOS
router.get('/:id/fpos', async (req: AuthRequest, res: Response) => {
  try {
    const fpos = await fpoService.getNearbyFPOs(req.user!.user_id, req.params.id as string);
    res.json({ success: true, data: fpos });
  } catch (error: any) {
    res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: error.message } });
  }
});

// FARMS
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const farms = await farmService.getFarmsByUser(req.user!.user_id);
    res.json({ success: true, data: farms });
  } catch (error: any) { res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } }); }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const farm = await farmService.createFarm(req.user!.user_id, req.body);
    res.status(201).json({ success: true, data: farm });
  } catch (error: any) { res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: error.message } }); }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const farm = await farmService.getFarmById(req.user!.user_id, req.params.id as string);
    res.json({ success: true, data: farm });
  } catch (error: any) { res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: error.message } }); }
});

router.patch('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const farm = await farmService.updateFarm(req.user!.user_id, req.params.id as string, req.body);
    res.json({ success: true, data: farm });
  } catch (error: any) { res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: error.message } }); }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    await farmService.deleteFarm(req.user!.user_id, req.params.id as string);
    res.json({ success: true, data: { deleted: true } });
  } catch (error: any) { res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: error.message } }); }
});

// CROPS
router.get('/:id/crops', async (req: AuthRequest, res: Response) => {
  try {
    const crops = await cropService.getCrops(req.user!.user_id, req.params.id as string);
    res.json({ success: true, data: crops });
  } catch (error: any) { res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: error.message } }); }
});

router.get('/:id/crop', async (req: AuthRequest, res: Response) => {
  try {
    const crop = await cropService.getActiveCrop(req.user!.user_id, req.params.id as string);
    res.json({ success: true, data: crop });
  } catch (error: any) { res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: error.message } }); }
});

router.post('/:id/crop', async (req: AuthRequest, res: Response) => {
  try {
    const crop = await cropService.createCrop(req.user!.user_id, req.params.id as string, req.body);
    res.status(201).json({ success: true, data: crop });
  } catch (error: any) { res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: error.message } }); }
});

// SOIL
router.get('/:id/soil', async (req: AuthRequest, res: Response) => {
  try {
    const soil = await soilService.getLatestSoilReading(req.user!.user_id, req.params.id as string);
    res.json({ success: true, data: soil });
  } catch (error: any) { res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: error.message } }); }
});

router.post('/:id/soil', async (req: AuthRequest, res: Response) => {
  try {
    const soil = await soilService.createSoilReading(req.user!.user_id, req.params.id as string, req.body);
    res.status(201).json({ success: true, data: soil });
  } catch (error: any) { res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: error.message } }); }
});

// WEATHER
router.get('/:id/weather', async (req: AuthRequest, res: Response) => {
  try {
    const weather = await weatherService.getWeather(req.user!.user_id, req.params.id as string);
    res.json({ success: true, data: weather });
  } catch (error: any) { res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: error.message } }); }
});

router.post('/:id/weather/refresh', async (req: AuthRequest, res: Response) => {
  try {
    const weather = await weatherService.refreshWeather(req.user!.user_id, req.params.id as string, req.body.mock);
    res.json({ success: true, data: weather });
  } catch (error: any) { res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: error.message } }); }
});

// CROP HEALTH
router.get('/:id/crop-health', async (req: AuthRequest, res: Response) => {
  try {
    const health = await cropHealthService.getLatestCropHealth(req.user!.user_id, req.params.id as string);
    res.json({ success: true, data: health });
  } catch (error: any) { res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: error.message } }); }
});

router.post('/:id/crop-health/analyze', async (req: AuthRequest, res: Response) => {
  try {
    const { cropId, imageUrl } = req.body;
    if (!imageUrl) throw new Error('Image URL is required');
    const health = await cropHealthService.analyzeCropImage(req.user!.user_id, req.params.id as string, cropId, imageUrl);
    res.json({ success: true, data: health });
  } catch (error: any) { res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: error.message } }); }
});

// MARKET
router.get('/:id/market', async (req: AuthRequest, res: Response) => {
  try {
    const market = await marketService.getMarketPrice(req.user!.user_id, req.params.id as string);
    res.json({ success: true, data: market });
  } catch (error: any) { res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: error.message } }); }
});

// SCHEMES
router.get('/:id/schemes', async (req: AuthRequest, res: Response) => {
  try {
    const schemes = await schemeService.getRelevantSchemes(req.user!.user_id, req.params.id as string);
    res.json({ success: true, data: schemes });
  } catch (error: any) { res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: error.message } }); }
});

// ADVISORY
router.get('/:id/advisory', async (req: AuthRequest, res: Response) => {
  try {
    const advisory = await advisoryService.getLatestAdvisory(req.user!.user_id, req.params.id as string);
    res.json({ success: true, data: advisory });
  } catch (error: any) { res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: error.message } }); }
});

router.get('/:id/advisories', async (req: AuthRequest, res: Response) => {
  try {
    const advisories = await advisoryService.getAdvisories(req.user!.user_id, req.params.id as string);
    res.json({ success: true, data: advisories });
  } catch (error: any) { res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: error.message } }); }
});

router.post('/:id/advisory/refresh', async (req: AuthRequest, res: Response) => {
  try {
    const advisory = await advisoryService.refreshFarmAdvisory(req.user!.user_id, req.params.id as string);
    res.json({ success: true, data: advisory });
  } catch (error: any) { res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: error.message } }); }
});

export default router;
