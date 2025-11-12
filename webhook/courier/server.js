const express = require('express');
const app = express();

app.use(express.json());

app.post('/order', (req, res) => {
	const order = req.body;
	console.log('BOMBOCLAT', order);
	setTimeout(() => {
    		console.log(`${order.id}: Restaurace připravuje`);

    		setTimeout(() => {
      			console.log(`${order.id}: Rozváží se`);

      			setTimeout(() => {
        				console.log(`${order.id}: Doručeno`);

        				res.status(200).json({ id: order.id, status: 'Doručeno' });

      			}, 5000);

    		}, 5000);

  	}, 5000);
});

app.listen(3000, () => {
	console.log('BOMBOCLAT ON localhost:3000');
});
