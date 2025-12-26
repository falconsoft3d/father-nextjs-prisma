import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function setAdmin() {
  const email = process.argv[2]
  
  if (!email) {
    console.log('❌ Proporciona un email: npx tsx scripts/set-admin.ts email@example.com')
    process.exit(1)
  }

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'admin' }
    })

    console.log(`✅ Usuario ${user.email} ahora es ADMIN`)
    console.log('🔄 Cierra sesión y vuelve a iniciar para ver el menú de Usuarios')
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setAdmin()
