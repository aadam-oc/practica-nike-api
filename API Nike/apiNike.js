// Import necessary modules
const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser'); // Asegura el parseo de JSON


// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'adamortcas';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware to handle JSON requests
app.use(express.json());

// Middleware to handle URL-encoded form data
app.use(bodyParser.json());


// Enable CORS
app.use(cors());

// Configuración de Swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Nike API",
            version: "1.0.0",
            description: "API para gestionar productos",
        },
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"  // Esto indica que el esquema usa JWT
                }
            }
        },
        security: [{ BearerAuth: [] }]
    },

    apis: ["./apiNike.js"], // Ensure this points to the correct file
};


const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Usar Swagger UI en el servidor
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Verify DB connection
db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
        process.exit(1); // Exit if connection fails
    }
    console.log("Connected to the database.");
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    // Verifica si el token está en el encabezado 'Authorization'
    const token = req.headers['authorization']?.split(' ')[1];  // Extrae el token de "Bearer <token>"

    if (!token) {
        return res.status(401).json({ error: 'Access denied, token missing!' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Invalid token:', err);
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;  // Agregar el usuario al objeto de la solicitud
        next();  // Continuar con la solicitud
    });
};





//Login

app.post('/nike/login', (req, res) => {
    const { correo, contrasena } = req.body;

    // Validate input fields
    if (!correo || !contrasena) {
        return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
    }

    // Query the database for the user
    db.query('SELECT * FROM nike.usuarios WHERE correo = ?', [correo], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Error processing login' });
        }

        if (results.length === 0) {
            // User not found
            return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
        }

        const user = results[0];

        // Compare the provided password with the stored hashed password
        bcrypt.compare(contrasena, user.contrasena, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ error: 'Error processing login' });
            }

            if (!isMatch) {
                // Passwords do not match
                return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: user.id_usuario, correo: user.correo },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            // Return the token
            res.json({ token, user: { id: user.id, correo: user.correo, rol: user.rol } });
        });
    });
});


//logout
app.post('/nike/logout', (req, res) => {
    res.json({ message: 'Logout successful' });
});




//Register
app.post('/nike/register', async (req, res) => {
    const { correo, contrasena, rol } = req.body;

    // Validate required fields
    if (!correo || !contrasena || !rol) {
        return res.status(400).json({ error: 'Correo, contraseña y rol son obligatorios' });
    }

    // Check if the email is already registered
    db.query('SELECT * FROM nike.usuarios WHERE correo = ?', [correo], (err, results) => {
        if (err) {
            console.error('Error checking user email:', err);
            return res.status(500).json({ error: 'Error checking email' });
        }

        if (results.length > 0) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        // Hash the password
        bcrypt.hash(contrasena, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).json({ error: 'Error hashing password' });
            }

            // Insert user into the database
            const query = 'INSERT INTO nike.usuarios (correo, contrasena, rol) VALUES (?, ?, ?)';
            db.query(query, [correo, hashedPassword, rol], (err, result) => {
                if (err) {
                    console.error('Error inserting user:', err);
                    return res.status(500).json({ error: 'Error registering user' });
                }

                // Generate JWT token
                const token = jwt.sign(
                    { id: result.insertId, correo },
                    JWT_SECRET,
                    { expiresIn: '1h' }
                );

                // Respond with success message and token
                res.status(201).json({
                    message: 'Usuario registrado con éxito',
                    token,
                    user: { id: result.insertId, correo, rol }
                });
            });
        });
    });
});



app.get('/nike/productos', async (_, res) => {
    db.query('SELECT * FROM nike.productos', (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).json({ error: 'Error fetching products' });
        }
        res.status(200).json(results);
    });
});




app.get('/nike/productos/:reference', async (req, res) => {
    const { reference } = req.params;
    db.query('SELECT * FROM nike.productos WHERE referencia = ?', [reference], (err, results) => {
        if (err) {
            console.error('Error fetching product:', err);
            return res.status(500).json({ error: 'Error fetching product' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(results[0]);
    });
});

app.get('/nike/productos/existe/:reference', async (req, res) => {
    const { reference } = req.params;
    db.query('SELECT * FROM nike.productos WHERE referencia = ?', [reference], (err, results) => {
        if (err) {
            console.error('Error fetching product:', err);
            return res.status(500).json({ error: 'Error fetching product' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(results[0]);
    });
});


app.post('/nike/productos', async (req, res) => {
    const { nombre, precio, descripcion, tipo_de_producto, en_oferta, ruta_imagen, referencia, cantidad } = req.body;

    //si el producto existe hace un put sumando uno a la cantidad usando el id_usuario y referencia


    db.query('INSERT INTO nike.productos ( nombre, precio, descripcion, tipo_de_producto, en_oferta, ruta_imagen, referencia, cantidad) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [nombre, precio, descripcion, tipo_de_producto, en_oferta, ruta_imagen, referencia, cantidad], (err, result) => {
        if (err) {
            console.error('Error creating actividad:', err);
            res.status(500).json({ error: 'Error creating actividad' });
        } else {
            res.json({ id: result.insertId });
        }
    });
});


app.put('/nike/productos/:referencia', async (req, res) => {
    const { referencia } = req.params;
    const { nombre, precio, descripcion, tipo_de_producto, en_oferta, ruta_imagen } = req.body;

    db.query('UPDATE nike.productos SET nombre = ?, precio = ?, descripcion = ?, tipo_de_producto = ?, en_oferta = ?, ruta_imagen = ? WHERE referencia = ?', [nombre, precio, descripcion, tipo_de_producto, en_oferta, ruta_imagen, referencia], (err, result) => {
        if (err) {
            console.error('Error updating product:', err);
            res.status(500).json({ error: 'Error updating product' });
        } else {
            res.json({ message: 'Product updated successfully' });
        }
    });
});

app.delete('/nike/productos/:referencia', async (req, res) => {
    const { referencia } = req.params;

    db.query('DELETE FROM nike.productos WHERE referencia = ?', [referencia], (err, result) => {
        if (err) {
            console.error('Error deleting product:', err);
            res.status(500).json({ error: 'Error deleting product' });
        } else {
            res.json({ message: 'Product deleted successfully' });
        }
    });
});

//carrito
app.get('/nike/carrito', async (req, res) => {
    db.query('SELECT * FROM nike.carrito ', (err, results) => {
        if (err) {
            console.error('Error fetching carrito:', err);
            return res.status(500).json({ error: 'Error fetching carrito' });
        }
        res.status(200).json(results);
    });
});

app.get('/nike/carrito/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;
    db.query('SELECT * FROM nike.carrito WHERE id_usuario = ?', [id_usuario], (err, results) => {
        if (err) {
            console.error('Error fetching carrito:', err);
            return res.status(500).json({ error: 'Error fetching carrito' });
        }
        res.status(200).json(results);
    });
});


//en el post si el producto ya existe en el carrito se suma uno a la cantidad
app.post('/nike/carrito', async (req, res) => {
    const { id_usuario, referencia, cantidad } = req.body;

    // Check if the product already exists in the carrito
    db.query('SELECT * FROM nike.carrito WHERE id_usuario = ? AND referencia_producto = ?', [id_usuario, referencia], (err, results) => {
        if (err) {
            console.error('Error checking carrito:', err);
            return res.status(500).json({ error: 'Error checking carrito' });
        }

        if (results.length > 0) {
            // If the product exists, update the quantity
            const newCantidad = results[0].cantidad + (cantidad || 1); // Default to 1 if cantidad is null
            db.query('UPDATE nike.carrito SET cantidad = ? WHERE id_usuario = ? AND referencia_producto = ?', [newCantidad, id_usuario, referencia], (err) => {
                if (err) {
                    console.error('Error updating carrito:', err);
                    return res.status(500).json({ error: 'Error updating carrito' });
                }
                return res.json({ message: 'Carrito updated successfully' });
            });
        } else {
            // If the product does not exist, insert it
            db.query('INSERT INTO nike.carrito (id_usuario, referencia_producto, cantidad) VALUES (?, ?, ?)', [id_usuario, referencia, cantidad || 1], (err, result) => {
                if (err) {
                    console.error('Error creating carrito:', err);
                    return res.status(500).json({ error: 'Error creating carrito' });
                }
                return res.json({ id: result.insertId });
            });
        }
    });
});

app.put('/nike/carrito/:id_usuario', authenticateToken, async (req, res) => {
    const { id_usuario } = req.params;
    const { referencia, cantidad } = req.body;

    db.query('UPDATE nike.carrito SET referencia_producto = ?, cantidad = ? WHERE id_usuario = ?', [referencia, cantidad, id_usuario], (err, result) => {
        if (err) {
            console.error('Error updating carrito:', err);
            res.status(500).json({ error: 'Error updating carrito' });
        } else {
            res.json({ message: 'Carrito updated successfully' });
        }
    });
});

app.delete('/nike/carrito/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;

    db.query('DELETE FROM nike.carrito WHERE id_usuario = ?', [id_usuario], (err, result) => {
        if (err) {
            console.error('Error deleting carrito:', err);
            res.status(500).json({ error: 'Error deleting carrito' });
        } else {
            res.json({ message: 'Carrito deleted successfully' });
        }
    });
});


//get usuarios
app.get('/nike/usuarios',  async (_, res) => {
    db.query('SELECT * FROM nike.usuarios', (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ error: 'Error fetching users' });
        }
        res.status(200).json(results);
    });
});

//update user
app.put('/nike/usuarios/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;
    const { correo, contrasena, rol } = req.body;

    // Hash the password before updating
    bcrypt.hash(contrasena, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({ error: 'Error hashing password' });
        }

        db.query('UPDATE nike.usuarios SET correo = ?, contrasena = ?, rol = ? WHERE id = ?', [correo, hashedPassword, rol, id_usuario], (err, result) => {
            if (err) {
                console.error('Error updating user:', err);
                res.status(500).json({ error: 'Error updating user' });
            } else {
                res.json({ message: 'User updated successfully' });
            }
        });
    });
});


//compras
app.get('/nike/compras', async (_, res) => {
    db.query('SELECT * FROM nike.compras', (err, results) => {
        if (err) {
            console.error('Error fetching compras:', err);
            return res.status(500).json({ error: 'Error fetching compras' });
        }
        res.status(200).json(results);
    });
});

app.get('/nike/compras/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;
    db.query('SELECT * FROM nike.compras WHERE id_usuario = ?', [id_usuario], (err, results) => {
        if (err) {
            console.error('Error fetching compras:', err);
            return res.status(500).json({ error: 'Error fetching compras' });
        }
        res.status(200).json(results);
    });
});

app.get('/nike/compras/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;
    db.query('SELECT * FROM nike.compras WHERE id_usuario = ?', [id_usuario], (err, results) => {
        if (err) {
            console.error('Error fetching compras:', err);
            return res.status(500).json({ error: 'Error fetching compras' });
        }
        res.status(200).json(results);
    });
});


app.post('/nike/comprar/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;
    

    // Fetch all items from the carrito for the user
    db.query('SELECT * FROM nike.carrito WHERE id_usuario = ?', [id_usuario], (err, carritoItems) => {
        if (err) {
            console.error('Error fetching carrito:', err);
            return res.status(500).json({ error: 'Error fetching carrito' });
        }

        if (carritoItems.length === 0) {
            return res.status(400).json({ error: 'No items in carrito to purchase' });
        }

        // Process each item in the carrito
        carritoItems.forEach((item, index) => {
            const { referencia_producto, cantidad } = item;

            // Insert the product into the compras table as a new purchase
            db.query('INSERT INTO nike.compras (id_usuario, referencia_producto, cantidad) VALUES (?, ?, ?)', [id_usuario, referencia_producto, cantidad], (err) => {
                if (err) {
                    console.error('Error creating compras:', err);
                    return res.status(500).json({ error: 'Error creating compras' });
                }
            });

            // Remove the item from the carrito
            db.query('DELETE FROM nike.carrito WHERE id_usuario = ? AND referencia_producto = ?', [id_usuario, referencia_producto], (err) => {
                if (err) {
                    console.error('Error deleting carrito:', err);
                    return res.status(500).json({ error: 'Error deleting carrito' });
                }

                // Send response after processing the last item
                if (index === carritoItems.length - 1) {
                    res.json({ message: 'Purchase completed successfully' });
                }
            });
        });
    });
});













// Handle undefined routes
app.use((req, res, next) => {
    res.status(404).json({ error: "Route not found" });
});

// Set port and start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
