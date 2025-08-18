import 'dotenv/config';
import { Client, LocalAuth, Message } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { loadPantry, savePantry, PantryItem } from "./pantry";

// Use environment variable or fallback to default
const TARGET_GROUP_ID = process.env.GROUP_ID || "120363403361236033@g.us";

let pantry: PantryItem[] = loadPantry();

const client = new Client({
    authStrategy: new LocalAuth({ dataPath: 'session' }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox']
    }
});

client.on("qr", (qr: string) => {
  console.log("Scan the following QR code with your WhatsApp app to connect:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("✅ Bot is connected and ready!");
  console.log(`👂 Listening only to group: ${TARGET_GROUP_ID}`);
});

// client.on("message", (message: Message) => {
//   console.log(`Hila: ${message.body} by ${message.fromMe}`);
//   handleMessage(message);
// });

client.on("message_create", (message: Message) => {
  // Check if the message is from the target group. If not, do nothing.
  if ((message.from !== TARGET_GROUP_ID && message.to !== TARGET_GROUP_ID) || message.ack !== 1) {
    return;
  }

  handleMessage(message);
});

function handleMessage(message: Message): void {
  const incomingMsg = message.body.trim();

  console.log(`Received message from ${message.from}: "${incomingMsg}"`);

  let replyMsg = "";

  // Add item: "תוסיף [amount] [item]"
  if (incomingMsg.startsWith("תוסיף ")) {
    const parts = incomingMsg.substring(6).trim().split(" ");
    let amount = 1;
    let itemName = parts.join(" ");

    if (parts.length > 1 && !isNaN(Number(parts[0]))) {
      amount = Number(parts[0]);
      itemName = parts.slice(1).join(" ");
    }

    if (itemName) {
      const existing = pantry.find((item) => item.name === itemName);
      if (existing) {
        existing.amount += amount;
      } else {
        pantry.push({ name: itemName, amount });
      }
      savePantry(pantry);
      replyMsg = `✅ נוספו ${amount} *${itemName}* למזווה! (סה"כ: ${pantry.find(
        (item) => item.name === itemName
      )?.amount})`;
    } else {
      replyMsg = "מה להוסיף?";
    }
  }
  // Remove item: "תוריד [amount] [item]"
  else if (incomingMsg.startsWith("תוריד ")) {
    const parts = incomingMsg.substring(6).trim().split(" ");
    let amount = 1;
    let itemName = parts.join(" ");

    if (parts.length > 1 && !isNaN(Number(parts[0]))) {
      amount = Number(parts[0]);
      itemName = parts.slice(1).join(" ");
    }

    const existing = pantry.find((item) => item.name === itemName);

    if (existing) {
      existing.amount -= amount;
      if (existing.amount <= 0) {
        pantry = pantry.filter((item) => item.name !== itemName);
        replyMsg = `🗑️ כל ה*${itemName}* נמחק מהמזווה.`;
      } else {
        replyMsg = `🗑️ ירדו ${amount} *${itemName}* מהמזווה. (נשאר: ${existing.amount})`;
      }
      savePantry(pantry);
    } else {
      replyMsg = `🤔 לא מצאתי *${itemName}* במזווה.`;
    }
  }
  // List items
  else if (incomingMsg.toLowerCase() === "מה יש?") {
    if (pantry.length === 0) {
      replyMsg = "המזווה ריק!";
    } else {
      const pantryList = pantry
        .map((item) => `• ${item.name} (${item.amount})`)
        .join("\n");
      replyMsg = `📋 *המזווה מכיל:*\n${pantryList}`;
    }
  }
  // Help
  else if (incomingMsg.toLowerCase() === "עזרה") {
    replyMsg = `👋 היי! אני הבוט מזווה שלך.\nתנסה את הפקודות הבאות:\n*תוסיף [כמות] [מרכיב]*\n*תוריד [כמות] [מרכיב]*\n*מה יש?*`;
  }

  if (replyMsg) {
    client.sendMessage(TARGET_GROUP_ID, replyMsg);
  }
}

export function startBot() {
  client.initialize();
}
