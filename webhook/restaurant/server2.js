import express from "express";

const app = express();
app.use(express.json());

const orders = {};

app.post("/update", (req, res) => {
  	const { id, status } = req.body;
  	orders[id] = status;
  	console.log(`Aktualizace: ${id} — ${status}`);
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
    	res.json({ message: "Objednávka odeslána kurýrovi", status: response.status });
  	} catch (err) {
    		console.error("Chyba při odesílání objednávky:", err);
    		res.status(500).json({ error: "Chyba při komunikaci s kurýrem" });
  	}
});

app.get("/orders", (req, res) => {
  	res.json(orders);
});

app.listen(3001, () => {
  	console.log("Restaurant runs on http://localhost:3001");
});

