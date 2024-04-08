import { unblockUser } from '$lib/utils/auth';
import { PrismaClient } from '@prisma/client';
import { redirect, type Actions } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const load = async ({ locals }) => {
	if (locals.user.role === 'USER') {
		throw redirect(302, '/dashboard');
	}

	const loginAttempts = await prisma.loginAttempt.findMany({
		include: {
			user: {
				select: {
					id: true,
					username: true,
					disabled: true
				}
			}
		}
	});

	const formattedLoginAttempts = loginAttempts.map((attempt) => ({
		...attempt,
		timestamp: attempt.timestamp.toISOString()
	}));

	return {
		loginAttempts: formattedLoginAttempts
	};
};

export const actions: Actions = {
	unblockUser: async ({ request }) => {
		const data = await request.formData();
		const userId = Number(data.get('userId'));

		await unblockUser(userId);

		return {
			success: true
		};
	}
};
