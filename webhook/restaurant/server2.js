const express = require('express');
const app = express();

app.use(express.json());

app.get('/send-order', async (req, res) => {
  	const order = {
    	id: 'objednavka1',
    	callbackUrl: 'http://localhost:3001/update'
  	};

  	try {
    		const response = await fetch('http://localhost:3000/order', {
      		method: 'POST',
      		headers: { 'Content-Type': 'application/json' },
      		body: JSON.stringify(order)
    	});

    	console.log('Courier response status:', response.status);
    	res.json({ message: 'Objednávka odeslána kurýrovi', status: response.status });
  	} catch (error) {
    		console.error('Chyba při odesílání objednávky:', error);
    		res.status(500).json({ error: 'Chyba při komunikaci s kurýrem' });
  	}
});

app.listen(3001, () => {
  	console.log('Restaurant runs on http://localhost:3001');
});

