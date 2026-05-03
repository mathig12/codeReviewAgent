import express from 'express';
import bodyParser from 'body-parser';
import { handleGithubWebhook } from '../events/dispatcher';

export function createServer() {
  const app = express();
  
  app.use(bodyParser.json());

  app.post('/webhook', async (req, res) => {
    try {
      const event = req.headers['x-github-event'] as string;
      
      // We mainly care about pull requests
      if (event === 'pull_request') {
        const payload = req.body;
        
        // Acknowledge the webhook quickly
        res.status(202).send('Accepted');
        
        // Process asynchronously
        await handleGithubWebhook(payload);
      } else {
        res.status(200).send(`Ignored event: ${event}`);
      }
    } catch (error) {
      console.error('Error handling webhook:', error);
      // We already sent 202, so we just log the error.
    }
  });

  return app;
}
