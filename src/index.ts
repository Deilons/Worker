import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

app.post('/procesar', (req: Request, res: Response) => {
  const message = req.body?.message?.data;

  if (message) {
    const decoded = Buffer.from(message, 'base64').toString();
    console.log('[WORKER] Mensaje recibido:', decoded);
  }

  res.status(200).send('ok');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Worker escuchando en puerto ${PORT}`);
});
