import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

app.post('/procesar', async (req, res) => {
  const message = req.body.message;
  const data = JSON.parse(
    Buffer.from(message.data, 'base64').toString()
  );

  const { reporteId } = data;

  console.log('[WORKER] Procesando reporte', reporteId);

  await axios.post(
    `https://TU_API_URL/api/reportes/${reporteId}/procesar`
  );

  res.status(200).send();
});

app.listen(8080, () => {
  console.log('Worker escuchando');
});
