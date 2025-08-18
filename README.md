# Pantrier Bot

Pantrier is a WhatsApp bot for managing a shared pantry. It allows users to add, remove, and list pantry items directly from a WhatsApp group using simple Hebrew commands.

## Features

- Add items to the pantry
- Remove items from the pantry
- List all pantry items
- Persistent storage in `pantry.json`
- WhatsApp group integration using [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web)

## Commands

Send these messages in your WhatsApp group to interact with the bot:

- **Add item:**  
  `תוסיף [כמות] [מרכיב]`  
  Example: `תוסיף 2 טונה`

- **Remove item:**  
  `תוריד [כמות] [מרכיב]`  
  Example: `תוריד 1 טונה`

- **List items:**  
  `מה יש?`

- **Help:**  
  `עזרה`

## Setup

### Prerequisites

- Node.js 20+
- Docker (optional, for containerized deployment)
- WhatsApp account

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   - Copy `.env` and set your WhatsApp group ID:
     ```
     GROUP_ID=your-group-id@g.us
     ```

3. **Build and run:**
   ```bash
   npm run build
   npm start
   ```

4. **Scan the QR code** with your WhatsApp app when prompted.

### Docker

1. **Build the Docker image:**
   ```bash
   docker build -t pantrier .
   ```

2. **Run the container:**
   ```bash
   docker run -it --rm \
     -v $(pwd)/pantry.json:/app/pantry.json \
     -v $(pwd)/session:/app/session \
     --env-file .env \
     pantrier
   ```

   - The bot will prompt you to scan a QR code for WhatsApp authentication.
   - Pantry data is persisted in `pantry.json`.

## File Structure

```
src/
  ├── bot.ts        # WhatsApp bot logic
  ├── index.ts      # Entry point
  └── pantry.ts     # Pantry storage functions
pantry.json         # Pantry data (auto-generated)
.env                # Environment variables
Dockerfile          # Docker build instructions
package.json        # Project metadata and scripts
```

## Technologies

- TypeScript
- Node.js
- whatsapp-web.js
- Puppeteer (headless Chrome)
- Docker

## Troubleshooting

If you see errors about missing libraries (e.g., `libgobject-2.0.so.0`) when running in Docker, make sure your Dockerfile includes all [Puppeteer dependencies](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md).

## License

ISC

## Author