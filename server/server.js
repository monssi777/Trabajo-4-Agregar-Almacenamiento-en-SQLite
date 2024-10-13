const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Conectar a la base de datos SQLite
const db = new sqlite3.Database('./tareas.db', (err) => {
  if (err) {
    console.error('Error al abrir la base de datos:', err.message);
  } else {
    console.log('Conexión exitosa a la base de datos SQLite.');
    // Crear tabla si no existe
    db.run(`CREATE TABLE IF NOT EXISTS tareas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descripcion TEXT NOT NULL,
      completada INTEGER DEFAULT 0
    )`, (err) => {
      if (err) {
        console.error('Error al crear la tabla:', err.message);
      } else {
        console.log('Tabla creada o ya existente.');
      }
    });
  }
});

// Ruta para agregar tarea
app.post('/tareas', (req, res) => {
  const { descripcion } = req.body;
  const query = `INSERT INTO tareas (descripcion) VALUES (?)`;
  db.run(query, [descripcion], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, descripcion, completada: 0 });
  });
});

// Ruta para obtener todas las tareas
app.get('/tareas', (req, res) => {
  const query = `SELECT * FROM tareas`;
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ tareas: rows });
  });
});

// Ruta para eliminar una tarea por ID
app.delete('/tareas/:id', (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM tareas WHERE id = ?`;
  db.run(query, id, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: 'Tarea eliminada correctamente' });
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
