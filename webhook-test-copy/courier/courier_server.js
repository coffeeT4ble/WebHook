import express from "express";
import fetch from "node-fetch";
import { randomUUID } from "crypto";

const app = express();
const PORT = 4000;

app.use(express.json());

app.post("/new-order", async (req, res) => {
  const { order_id, restaurant_url } = req.body;

  console.log(`Přijal jsem novou objednávku ${order_id} od restaurace.`);

  setTimeout(() => sendStatus(restaurant_url, order_id, "Přijato kurýrem"), 1000);
  setTimeout(() => sendStatus(restaurant_url, order_id, "Na cestě"), 3000);
  setTimeout(() => sendStatus(restaurant_url, order_id, "Doručeno"), 5000);

  res.status(200).send("Order accepted");
});

async function sendStatus(restaurant_url, order_id, status) {
  const event_id = randomUUID();
  const payload = { event_id, order_id, status };

  console.log(`Odesílám webhook (event_id: ${event_id}) - objednávka ${order_id}: ${status}`);

  try {
    await fetch(restaurant_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (Math.random() < 0.5) {
      console.log(`↩Posílám DUPLICITU pro event_id: ${event_id}`);
      await fetch(restaurant_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
  } catch (err) {
    console.error("Chyba při odesílání webhooku:", err);
  }
}

app.listen(PORT, () => {
  console.log(`Courier server běží na http://localhost:${PORT}`);
});
