import { PrismaClient } from '@prisma/client'
import readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

async function makeAdmin() {
  console.log('\n=== Convertir usuario a Admin ===\n')

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true
    }
  })

  if (users.length === 0) {
    console.log('❌ No hay usuarios en la base de datos')
    process.exit(1)
  }

  console.log('Usuarios disponibles:\n')
  users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.email} - ${user.name || 'Sin nombre'} (${user.role})`)
  })

  rl.question('\nIngresa el número del usuario a hacer admin: ', async (answer) => {
    const index = parseInt(answer) - 1

    if (index < 0 || index >= users.length) {
      console.log('❌ Opción inválida')
      rl.close()
      process.exit(1)
    }

    const selectedUser = users[index]

    try {
      await prisma.user.update({
        where: { id: selectedUser.id },
        data: { role: 'admin' }
      })

      console.log(`\n✅ Usuario ${selectedUser.email} ahora es ADMIN`)
      console.log('\n🔄 Cierra sesión y vuelve a iniciar para ver el menú de Usuarios\n')
    } catch (error) {
      console.error('❌ Error al actualizar usuario:', error)
    }

    rl.close()
    await prisma.$disconnect()
  })
}

makeAdmin().catch(console.error)
