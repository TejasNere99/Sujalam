# Data Model (MongoDB)

This document outlines the data model and collections in MongoDB for Sujalam 2.0.

## Collections
- **users**: Stores farmer profiles and authentication details (hashed password).
- **farms**: Stores farm location, area, and preferences. References `users`.
- **farmcrops**: Active and historical crops. References `farms`.
- **soilreadings**: Timeseries data for soil conditions. References `farms`.
- **weathersnapshots**: Historical and forecasted weather data. References `farms`.
- **crophealths**: Plant.id analysis results. References `farms`.
- **marketprices**: Daily commodity pricing.
- **schemes**: Government schemes and FPOs.
- **advisories**: Generated farm advisories. References `farms`.
- **whatsappusers**: Maps a phone number to a `user_id` and `farm_id`.

## Ownership Model
Data is isolated per user. Every API request accessing a farm (or its related entities) verifies that `farm.user_id === req.user.user_id` using the `assertFarmOwnership` helper.

## Contract Boundary
While MongoDB uses `_id` internally, API responses will map the data to the stable frozen contracts defined in `shared/types/index.ts` so that the frontend remains oblivious to the underlying database engine.
