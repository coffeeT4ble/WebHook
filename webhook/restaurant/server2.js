import express from 'express';

const app = express();
app.use(express.json());

app.get('/send-order', async (req, res) => {
  	const order = {
    		id: 'objednavka1',
    		callbackUrl: 'http://localhost:3001/update'
	};

  	console.log('Odesílám objednávku kurýrovi...');

  	try {
    		const response = await fetch('http://localhost:3000/order', {
      		method: 'POST',
      		headers: { 'Content-Type': 'application/json' },
      		body: JSON.stringify(order)
    	});

    	const result = await response.json();
    	console.log('Odpověď od kurýra:', result);

   	 res.json({
      		message: 'Objednávka dokončena',
      		courierResponse: result
    	});
} catch (error) {
    	console.error('Chyba při odesílání objednávky:', error);
    	res.status(500).json({ error: 'Chyba při komunikaci s kurýrem' });
}
});

app.listen(3001, () => {
  console.log('Restaurant runs on http://localhost:3001');
});

