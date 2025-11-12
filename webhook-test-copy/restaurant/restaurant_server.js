import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const orders = {};
const processedEvents = new Set();

app.get("/send-order", async (req, res) => {
  const orderId = Math.floor(Math.random() * 10000);
  orders[orderId] = "Odesláno kurýrovi";

  console.log(`Odesílám objednávku ${orderId} kurýrovi...`);

  try {
    await fetch("http://localhost:4000/new-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_id: orderId,
        restaurant_url: "http://localhost:3000/webhook",
      }),
    });

    res.status(200).send("Order sent");
  } catch (err) {
    console.error("Chyba při odesílání na kurýra:", err);
    res.status(500).send("Error");
  }
});

app.get("/orders", (req, res) => {
  res.json(orders);
});

app.post("/webhook", (req, res) => {
  const { event_id, order_id, status } = req.body;
  if (!event_id || !order_id) {
    console.log("Webhook bez event_id nebo order_id, ignoruji");
    return res.status(400).send("Missing event_id or order_id");
  }


  if (processedEvents.has(event_id)) {
    console.log(`Duplicitní notifikace (event_id: ${event_id}), ignoruji`);
    return res.status(200).send("Duplicate ignored");
  }


  processedEvents.add(event_id);

  orders[order_id] = status;

  console.log(`Nová notifikace (event_id: ${event_id}) - objednávka ${order_id} → ${status}`);
  res.status(200).send("OK");
});


app.listen(PORT, () => {
  console.log(`Restaurant server běží na http://localhost:${PORT}`);
});
