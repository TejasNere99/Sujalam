# MongoDB Setup

The Sujalam backend uses MongoDB as its primary database.

## Environment Variables
Ensure the following are set in your `.env` file:
- `MONGODB_URI`: The connection string (e.g., `mongodb://127.0.0.1:27017/sujalam` or Atlas URI).
- `MONGODB_DB_NAME`: The specific database name (default: `sujalam`).

## Local Development
You can run MongoDB locally or use MongoDB Atlas.
1. **Local**: Ensure `mongod` is running. Use the default connection string provided in `.env.example`.
2. **Atlas**: Set `MONGODB_URI` to your Atlas connection string.

## Indexes
Important indexes have been configured in the Mongoose schemas (e.g., `farm_id` + `recorded_at` for timeseries data) to ensure fast lookup of the "latest" records.
