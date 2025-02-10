import cors from 'cors';
import express from 'express';
import env from './env.js';
import { cwd } from 'process';
import ConnectDB from './src/config/db.js';
import dashboardRoutes from './src/routes/dashboard/DashboardRoutes.js';
import frontendRoutes from './src/routes/frontend/FrontendRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(cwd() + '/uploads', { maxAge: 31557600 }));

app.use('/dashboard/api', dashboardRoutes);
app.use('/frontend/api',frontendRoutes);

const port = env.PORT;

// app.get('/:num1/:num2', (req, res) => {
// 	const { num1, num2 } = req.params;
// 	const result = Number(num1) + Number(num2);
// 	res.json(`${result}`);
// });

// app.get('/', (req, res) => {
// 	const { num1, num2 } = req.query;
// 	const result = Number(num1) + Number(num2);
// 	res.json(`${result}`);
// });

// app.post('/', (req, res) => {
// 	const { a, b } = req.body;
// 	const result = a + b;
// 	res.send(`${result}`);
// });

ConnectDB();
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
