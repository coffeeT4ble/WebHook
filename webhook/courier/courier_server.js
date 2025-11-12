import express from "express";
import crypto from "crypto";

const app = express();
app.use(express.json());
const SHARED_SECRET = process.env.SHARED_SECRET || "mysecret123";

app.post("/order", (req, res) => {
  const order = req.body;
  console.log(`Přijata objednávka ${order.id}`);

  res.sendStatus(202);

  const statuses = ["Restaurace připravuje", "Rozváží se", "Doručeno"];

  statuses.forEach((status, i) => {
    setTimeout(async () => {
      const payload = { id: order.id, status };
      const body = JSON.stringify(payload);
      const signature = crypto
        .createHmac("sha256", SHARED_SECRET)
        .update(body, "utf8")
        .digest("hex");

      try {
        const response = await fetch(order.callbackUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Signature": signature,
          },
          body,
        });

        console.log(
          `${order.id}: ${status} (odesláno restauraci, odpověď ${response.status})`
        );
      } catch (err) {
        console.error(`Chyba při odesílání webhooku:`, err);
      }
    }, (i + 1) * 5000);
  });
});

app.listen(3000, () => {
  console.log("Courier runs on http://localhost:3000");
});

