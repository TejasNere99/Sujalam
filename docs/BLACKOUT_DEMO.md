# Blackout Hackathon Demo Script

The system includes a live simulation page at `/resilience` to demonstrate the hackathon challenge.

## Setup
1. Ensure both frontend (`npm run dev` in `Sujalam_frontend/`) and backend (`npm run dev` in `Sujalam/`) are running.
2. Login as a farmer.
3. Open a second tab and navigate to `http://localhost:5173/resilience`.

## Demo Steps
### 1. The Normal State
- In the `/resilience` dashboard, observe the "SYSTEM HEALTHY" banner. The primary database is ONLINE.
- In your main tab, use the Sujalam app normally (view farm, get advisory).

### 2. The Blackout
- Go to the `/resilience` dashboard and click **"1. Create Snapshot"**. This dumps the current valid state to disk.
- Click **"💥 2. SIMULATE DATABASE FAILURE"**.
- Watch the dashboard. The health monitor will ping the (simulated offline) database.
- After 3 consecutive failures, the status will shift to **RECOVERY MODE ACTIVE**.

### 3. Proof of Resilience
- Go back to your main tab. **Refresh the page**.
- Notice the **yellow Resilience Banner** at the top: *"RECOVERY MODE: Primary database is temporarily unavailable."*
- **Crucial Part**: You can still see your farm, crop health, and weather! This data is being served from the reconstructed in-memory state.
- **Action**: Add a new Crop Reading or request a New AI Advisory.
- The AI will process it successfully and save it.
- Go back to the `/resilience` dashboard. Notice that "Pending Sync" events have increased!

### 4. Restoration
- On the `/resilience` dashboard, click **"🔄 3. RESTORE DATABASE & SYNC"**.
- The system will immediately replay your pending events (the new Crop/Advisory) directly into MongoDB.
- Go back to the main tab, refresh the page, the yellow banner disappears. Your data is perfectly intact in the primary database!
