const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    console.log('Generating 40 users...')

    const password = await bcrypt.hash('123456', 10)

    for (let i = 1; i <= 40; i++) {
        const userNumber = Math.floor(Math.random() * 10000)
        await prisma.user.create({
            data: {
                name: `User Test ${userNumber}`,
                email: `user${userNumber}@example.com`,
                password: password,
                role: 'user',
                image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userNumber}`,
            }
        })
        process.stdout.write('.')
    }

    console.log('\nDone! 40 users created.')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
