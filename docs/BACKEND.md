# Backend Architecture

Sujalam backend is the intelligence layer combining various data sources to provide actionable insights for farmers.

- Node.js + Express
- TypeScript
- MongoDB (via Mongoose ODM)
- JWT Authentication

## Core Components
- **Auth**: JWT based stateless auth.
- **Services**: Interact with MongoDB via Mongoose.
- **Decision Engine**: Combines signals to form actionable advisories.
- **WhatsApp Webhook**: Same shared backend routes for WhatsApp bot.
