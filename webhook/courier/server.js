import express from "express";

const app = express();
app.use(express.json());

app.post("/order", (req, res) => {
  	const order = req.body;
  	console.log(`Přijata objednávka ${order.id}`);

  	res.status(202).json({ message: "Objednávka přijata", id: order.id });

  	const sendStatus = async (status) => {
    		try {
      			await fetch(order.callbackUrl, {
        		method: "POST",
        		headers: { "Content-Type": "application/json" },
        		body: JSON.stringify({ id: order.id, status }),
      		});
      		console.log(`Odesláno restauraci: ${order.id} — ${status}`);
    		} catch (err) {
      			console.error(`Chyba při odesílání webhooku (${status}):`, err);
    		}
	};

  	setTimeout(() => sendStatus("Restaurace připravuje"), 5000);
  	setTimeout(() => sendStatus("Rozváží se"), 10000);
  	setTimeout(() => sendStatus("Doručeno"), 15000);
});

app.listen(3000, () => {
  	console.log("Courier runs on http://localhost:3000");
});

