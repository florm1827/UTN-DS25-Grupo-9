import express from 'express';
const app = express();
const PORT = 3000;

// Middleware para leer JSON
app.use(express.json());

// Lista de usuarios (guardada en memoria)
let usuarios = [
  { id: 1, nombre: "Juan", edad: 25 },
  { id: 2, nombre: "María", edad: 30 },
  { id: 3, nombre: "Pedro", edad: 28 }
];

// GET → devuelve la lista de usuarios
app.get('/usuarios', (req, res) => {
  res.json(usuarios);
});

// POST → agrega un usuario nuevo
app.post('/usuarios', (req, res) => {
  const nuevoUsuario = req.body;   // lo que manda el cliente en el body

  if (!nuevoUsuario.nombre || !nuevoUsuario.edad) {
    return res.status(400).json({ error: "Faltan datos (nombre y edad)" });
  }

  const id = usuarios.length + 1;  // genera un id automático
  const usuarioConId = { id, ...nuevoUsuario };

  usuarios.push(usuarioConId);     // lo agrega a la lista

  res.status(201).json(usuarioConId); // responde con el usuario creado
});

// Servidor escuchando en puerto 3000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
