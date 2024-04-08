import prisma from '$lib/database/prisma';
import type { Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';

export const handle: Handle = async ({ event, resolve }) => {
	const session = await event.cookies.get('authToken');

	if (!session) {
		return await resolve(event);
	}

	const claims = jwt.verify(session, JWT_SECRET) as { userId: number; role: string };

	if (!claims) {
		return await resolve(event);
	}

	if (session && claims) {
		const user = await prisma.user.findUnique({
			where: { id: claims.userId }
		});

		if (user) {
			event.locals.user = {
				id: user.id,
				name: user.username,
				role: user.role
			};
		}
	}

	return await resolve(event);
};
