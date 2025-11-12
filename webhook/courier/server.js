const express = require('express');
const app = express();

app.use(express.json());

app.post('/order', (req, res) => {
	const order = req.body;
	console.log('BOMBOCLAT', order);
	res.sendStatus(202);
});

app.listen(3000, () => {
	console.log('BOMBOCLAT ON localhost:3000');
});
