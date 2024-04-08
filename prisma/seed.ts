import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
	const password = await bcrypt.hash('password123', 10);

	const users = [
		{
			username: 'admin',
			password,
			role: Role.MANAGER
		},
		{
			username: 'john',
			password,
			role: Role.USER,
			disabled: true
		},
		{
			username: 'jane',
			password,
			role: Role.USER
		}
	];

	for (const user of users) {
		await prisma.user.create({ data: user });
	}

	console.log('Users seeded successfully');
}

main()
	.catch((error) => {
		console.error(error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
