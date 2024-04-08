import {
	createLoginAttempt,
	createSession,
	getUserByUsername,
	getUserLoginAttempts,
	blockUser
} from '$lib/utils/auth';
import { LoginStatus } from '@prisma/client';
import { fail, type Actions, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';

export const load = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/');
	}
};

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username')?.toString() ?? '';
		const password = data.get('password')?.toString() ?? '';
		const user = await getUserByUsername(username);

		if (!user) {
			return fail(401, { message: 'Invalid username or password' });
		}

		if (user.disabled) {
			return fail(401, {
				message:
					'You have been locked out. Please speak to the Government Information Systems Unit to recover the account.'
			});
		}

		const loginAttempts = await getUserLoginAttempts(user.id);
		const failedAttempts = loginAttempts.filter(
			(attempt) => attempt.status === LoginStatus.FAILED
		).length;

		if (failedAttempts >= 3) {
			await blockUser(user.id);
			return fail(401, {
				message:
					'You have been locked out. Please speak to the Government Information Systems Unit to recover the account.'
			});
		}

		const valid = await bcrypt.compare(password, user.password);

		if (valid) {
			await createLoginAttempt(user.id, LoginStatus.SUCCESS);
			createSession(user.id, user.role);
			cookies.set('authToken', createSession(user.id, user.role), {
				httpOnly: true,
				path: '/',
				maxAge: 60 * 60,
				sameSite: 'strict'
			});
			throw redirect(302, '/dashboard');
		} else {
			await createLoginAttempt(user.id, LoginStatus.FAILED);
			const remainingAttempts = 3 - failedAttempts - 1;
			return fail(401, {
				message: `Invalid username or password. You have ${remainingAttempts} attempt(s) remaining.`
			});
		}
	}
};
