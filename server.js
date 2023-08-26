const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');

app.use(express.static('public'));
app.use(express.json());

// Configurar Multer para manejar la subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/Imagen');
  },
  filename: (req, file, cb) => {
    cb(null, 'imagen_procesada.png');
  }
});

const upload = multer({ storage });

app.post('/guardar-imagen', upload.single('file'), (req, res) => {
  console.log('Imagen guardada correctamente.');
  res.json({ message: 'Imagen guardada correctamente' });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
