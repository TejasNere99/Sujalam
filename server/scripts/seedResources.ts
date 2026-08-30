import mongoose from 'mongoose';
import { connectMongoDB } from '../lib/mongodb';
import { FarmLabour } from '../models/FarmLabour';
import { FarmMachinery } from '../models/FarmMachinery';

async function seedResources() {
  await connectMongoDB();
  
  console.log('Seeding demo resources...');
  
  // Clear existing
  await FarmLabour.deleteMany({});
  await FarmMachinery.deleteMany({});

  // Common demo coords: 28.7041, 77.1025 (Delhi area mock)
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(8, 0, 0, 0);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  // Machinery
  await FarmMachinery.create([
    {
      provider_id: 'provider-m-1',
      machine_type: 'PUMP',
      machine_name: 'Honda 5HP Water Pump',
      hourly_rate: 500,
      operator_available: true,
      availability_status: 'AVAILABLE',
      available_from: new Date(),
      available_until: nextWeek,
      location: {
        type: 'Point',
        coordinates: [77.1225, 28.7241] // ~3.2km away
      },
      verified: true
    },
    {
      provider_id: 'provider-m-2',
      machine_type: 'PUMP',
      machine_name: 'Kirloskar Pump',
      hourly_rate: 400,
      operator_available: false, // Cheaper but no operator
      availability_status: 'AVAILABLE',
      available_from: new Date(),
      available_until: nextWeek,
      location: {
        type: 'Point',
        coordinates: [77.1625, 28.7541] // ~7.8km away
      },
      verified: true
    },
    {
      provider_id: 'provider-m-3',
      machine_type: 'HARVESTER',
      machine_name: 'Mahesh Equipments Harvester',
      hourly_rate: 1200,
      operator_available: true,
      availability_status: 'AVAILABLE',
      available_from: tomorrow,
      available_until: nextWeek,
      location: {
        type: 'Point',
        coordinates: [77.1325, 28.7341] // ~4.2km away
      },
      verified: true
    },
    {
      provider_id: 'provider-m-4',
      machine_type: 'TRACTOR',
      machine_name: 'Mahindra 575 DI',
      hourly_rate: 800,
      operator_available: true,
      availability_status: 'BUSY', // Currently busy
      available_from: new Date(),
      available_until: nextWeek,
      location: {
        type: 'Point',
        coordinates: [77.1125, 28.7141] // Very close
      },
      verified: true
    }
  ]);

  // Labour
  await FarmLabour.create([
    {
      provider_id: 'provider-l-1',
      name: 'Ramesh Group',
      labour_type: 'HARVESTING',
      workers_available: 5,
      max_workers: 10,
      daily_rate: 450,
      availability_status: 'AVAILABLE',
      available_from: tomorrow,
      available_until: nextWeek,
      location: {
        type: 'Point',
        coordinates: [77.1125, 28.7141] // ~2km away
      },
      verified: true
    },
    {
      provider_id: 'provider-l-2',
      name: 'Suresh Group',
      labour_type: 'GENERAL',
      workers_available: 3,
      max_workers: 5,
      daily_rate: 400,
      availability_status: 'AVAILABLE',
      available_from: tomorrow,
      available_until: nextWeek,
      location: {
        type: 'Point',
        coordinates: [77.1425, 28.7441] // ~5km away
      },
      verified: true
    }
  ]);

  console.log('Done seeding resources.');
  process.exit(0);
}

seedResources().catch(console.error);
