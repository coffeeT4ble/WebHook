import express from "express";
import crypto from "crypto";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const SHARED_SECRET = process.env.SHARED_SECRET || "mysecret123";

app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "public")));

const orders = {};

app.post("/update", (req, res) => {
  const sigHeader = (req.get("X-Signature") || "").trim();
  const expectedSig = crypto
    .createHmac("sha256", SHARED_SECRET)
    .update(req.rawBody)
    .digest("hex");

  if (sigHeader !== expectedSig) {
    console.warn("Neplatný podpis webhooku! Požadavek zamítnut.");
    return res.sendStatus(401);
  }

  const { id, status } = req.body;
  orders[id] = status;
  console.log(`Přijatý a ověřený update: ${id} — ${status}`);
  res.sendStatus(200);
});

app.get("/send-order", async (req, res) => {
  const order = {
    id: `objednavka-${Date.now()}`,
    callbackUrl: "http://localhost:3001/update",
  };

  console.log(`Odesílám objednávku ${order.id} kurýrovi...`);

  try {
    const response = await fetch("http://localhost:3000/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    console.log(`Kurýr odpověděl: ${response.status}`);
    res.redirect("/");
  } catch (err) {
    console.error("Chyba při odesílání objednávky:", err);
    res.status(500).send("Chyba při komunikaci s kurýrem");
  }
});

app.get("/orders", (req, res) => {
  res.json(orders);
});

app.listen(3001, () => {
  console.log("Restaurant runs on http://localhost:3001");
});

