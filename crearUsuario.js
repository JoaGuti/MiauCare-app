const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// CONFIGURACIÓN: Cambia esto si tu base de datos no es local o tiene otro nombre
const MONGO_URI = 'mongodb://localhost:27017/miaucare'; 

// DEFINICIÓN DEL MODELO (Ajusta los campos si tu app MiauCare pide algo más, ej: email)
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

async function registrarUsuario() {
    try {
        // 1. Conectar a la base de datos de MiauCare
        await mongoose.connect(MONGO_URI);
        console.log('🔄 Conectado exitosamente a la base de datos de MiauCare...');

        const usernameInput = 'JoaGuti';
        const passwordInput = '44076698';

        // 2. Verificar si el usuario ya existe para no duplicarlo
        const usuarioExistente = await User.findOne({ username: usernameInput });
        if (usuarioExistente) {
            console.log(`⚠️ El usuario "${usernameInput}" ya existe en la base de datos.`);
            return;
        }

        // 3. Encriptar la contraseña (Seguridad)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(passwordInput, saltRounds);

        // 4. Crear el nuevo registro
        const nuevoUsuario = new User({
            username: usernameInput,
            password: hashedPassword
        });

        // 5. Guardar en la base de datos
        await nuevoUsuario.save();
        console.log(`\n✅ ¡Usuario creado con éxito!`);
        console.log(`👤 Username: ${usernameInput}`);
        console.log(`🔒 Password guardada como Hash: ${hashedPassword.substring(0, 15)}...`);

    } catch (error) {
        console.error('❌ Hubo un error al intentar registrar el usuario:', error);
    } finally {
        // 6. Cerrar la conexión
        await mongoose.disconnect();
        console.log('🔌 Conexión con la base de datos cerrada.');
    }
}

// Ejecutar la función
registrarUsuario();