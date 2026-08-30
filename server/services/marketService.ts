import { MarketPrice } from '../models/MarketPrice';
import { getActiveCrop } from './cropService';

export const getMarketPrice = async (userId: string, farmId: string) => {
  const activeCrop = await getActiveCrop(userId, farmId);
  if (!activeCrop) return null;

  // Find latest market price for this crop
  let price = await MarketPrice.findOne({ crop_name: activeCrop.crop_name }).sort({ recorded_at: -1 }).lean();
  
  // Fetch fresh data if we have no price, OR if the price we have is just the old mock data!
  if (!price || price.source === 'simulated') {
    if (process.env.MARKET_API_KEY) {
      try {
        // Example integration: Replace with actual Government Data API or scraping service endpoint
        const response = await fetch(`https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${process.env.MARKET_API_KEY}&format=json&filters[commodity]=${activeCrop.crop_name}`);
        const data = await response.json();
        
        if (response.ok && data.records && data.records.length > 0) {
          const latestRecord = data.records[0];
          const newPrice = new MarketPrice({
            crop_name: activeCrop.crop_name,
            market_name: latestRecord.market || 'Local Mandi',
            price_per_quintal: parseFloat(latestRecord.modal_price) || 7100,
            trend_7d_percent: 0, 
            recorded_at: new Date(),
            source: 'data.gov.in'
          });
          await newPrice.save();
          return { ...newPrice.toObject(), id: newPrice._id.toString() };
        }
      } catch (e) {
        console.error('Market API Error:', e);
      }
    }

    // Fallback to Mock data for demo
    const newPrice = new MarketPrice({
      crop_name: activeCrop.crop_name,
      market_name: 'Local Mandi',
      price_per_quintal: 7100, // Demo value
      trend_7d_percent: 4.2, // Demo value
      recorded_at: new Date(),
      source: 'simulated'
    });
    await newPrice.save();
    price = newPrice.toObject() as any; // Cast needed as Mongoose return type includes internal fields
  }

  return price ? { ...price, id: (price as any)._id.toString() } : null;
};
