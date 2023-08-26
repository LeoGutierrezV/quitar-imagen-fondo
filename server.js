const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Python
const spawn = require("child_process").spawn;

app.use(express.static("public"));
app.use(express.json());

// Configurar Multer para manejar la subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/Imagen");
  },
  filename: (req, file, cb) => {
    cb(null, "imagen_procesada.png");
  },
});

const upload = multer({ storage });

app.post("/guardar-imagen", upload.single("file"), (req, res) => {
  console.log("Imagen guardada correctamente.");

  const imagePath = req.file.path;
  const pythonProcess = spawn("python", ["./app.py", imagePath]);

  pythonProcess.stdout.on("data", (data) => {
    console.log(`Mensaje desde Python: ${data}`);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Error en Python: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    if (code === 0) {
      console.log("Proceso de Python completado exitosamente");
    } else {
      console.error(
        `Proceso de Python finalizado con código de salida ${code}`
      );
    }
    res.json({ message: "Imagen guardada y procesada correctamente" });
  });
});

app.post("/guardar-imagen-generada", upload.single("file"), (req, res) => {
  console.log("Imagen guardada correctamente.");
  res.json({ message: "Imagen guardada y procesada correctamente" });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
