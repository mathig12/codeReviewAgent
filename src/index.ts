import * as dotenv from 'dotenv';
dotenv.config();

import { createServer } from './api/server';

const PORT = process.env.PORT || 3000;

const app = createServer();

app.listen(PORT, () => {
  console.log(`🚀 AI Code Review Agent listening on port ${PORT}`);
  console.log(`Use ngrok to expose this port: ngrok http ${PORT}`);
});
