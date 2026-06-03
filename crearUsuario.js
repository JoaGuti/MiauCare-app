const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const usernameInput = 'JoaGuti';
  const passwordInput = '44076698';

  // 1. Encriptar la contraseña de forma segura
  const hashedPassword = await bcrypt.hash(passwordInput, 10);

  try {
    // 2. Insertar el usuario en la tabla correcta de Prisma
    // Nota: Si tu modelo de Prisma se llama de otra forma (ej: 'usuario'), cambia prisma.user por prisma.usuario
    const nuevoUsuario = await prisma.user.create({
      data: {
        username: usernameInput,
        password: hashedPassword,
      },
    });

    console.log(`\n✅ ¡Usuario creado con éxito en tu SQLite local!`);
    console.log(`👤 Username: ${nuevoUsuario.username}`);
  } catch (error) {
    if (error.code === 'P2002') {
      console.log(`⚠️ El usuario "${usernameInput}" ya existe en la base de datos.`);
    } else {
      console.error('❌ Error al crear el usuario. Es posible que los campos de tu modelo sean diferentes:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();