import express from 'express';
import cors from 'cors';
import { connectMongoDB, getMongoDBStatus } from './lib/mongodb';
import authRoutes from './routes/auth';
import meRoutes from './routes/me';
import farmRoutes from './routes/farms';
import whatsappRoutes from './routes/whatsapp';
import resilienceRoutes from './routes/resilience';
import trustRoutes from './routes/trust';
import { startHealthMonitor } from './resilience/healthMonitor';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

import { resourceRoutes } from './routes/resourceRoutes';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/me', meRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/resilience', resilienceRoutes);
app.use('/api/trust', trustRoutes);
app.use('/api/resources', resourceRoutes);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    database: getMongoDBStatus(),
    timestamp: new Date().toISOString() 
  });
});

const startServer = async () => {
  try {
    await connectMongoDB();
    
    // Start Resilience System Health Monitor
    startHealthMonitor();
    
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
