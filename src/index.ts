import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

app.post('/procesar', async (req, res) => {
  const mensaje = req.body.message;
  const data = JSON.parse(
    Buffer.from(mensaje.data, 'base64').toString()
  );

  const { reporteId } = data;

  console.log('[WORKER] Evento recibido:', reporteId);

  await axios.post(
    `http://192.168.1.68:3000/api/reportes${reporteId}/procesar`,
    { method: 'POST' }
  );

  res.status(200).send();
});

app.listen(8080, () =>
  console.log('Worker escuchando')
);
