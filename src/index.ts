import express from 'express';
import Redis from 'ioredis';
import PDFDocument from 'pdfkit';
import fs from 'fs';

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL!);

app.post('/procesar', async (req, res) => {
  const mensaje = req.body.message;
  const { reporteId } = JSON.parse(
    Buffer.from(mensaje.data, 'base64').toString()
  );

  console.log('[WORKER] Procesando reporte', reporteId);

  const reporteRaw = await redis.get(`reporte:${reporteId}`);
  if (!reporteRaw) return res.sendStatus(200);

  const reporte = JSON.parse(reporteRaw);

  reporte.estado = 'PROCESANDO';
  await redis.set(`reporte:${reporteId}`, JSON.stringify(reporte));

  // trabajo pesado
  await new Promise(r => setTimeout(r, 15000));

  // generar PDF
  const filePath = `/tmp/reporte-${reporteId}.pdf`;
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));
  doc.text(reporte.contenido);
  doc.end();

  reporte.estado = 'COMPLETADO';
  reporte.resultadoPdfUrl = filePath;

  await redis.set(`reporte:${reporteId}`, JSON.stringify(reporte));

  res.sendStatus(200);
});

app.listen(8080, () => console.log('Worker listo'));
