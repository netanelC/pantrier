import express from 'express';
import { startBot } from './bot';

console.log('🤖 Starting the Pantry Bot...');
startBot();

// Minimal web server for Render
const app = express();
const PORT = process.env.PORT || 8085;

app.get("/", (_, res) => res.send("Pantrier bot is running!"));
app.get("/liveness", (_, res) => res.status(200).send("ok"));

app.listen(PORT, () => {
  console.log(`Health server listening on port ${PORT}`);
});
