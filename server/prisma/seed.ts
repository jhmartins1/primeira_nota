import { prisma } from '../src/prisma/client'

async function main() {
    const niveis = ['Iniciante', 'Intermediário', 'Avançado'];

    for (const name of niveis) {
        await prisma.nivel.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }

    console.log('Níveis criados com sucesso');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });