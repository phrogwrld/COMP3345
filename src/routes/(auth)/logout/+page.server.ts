import { redirect } from '@sveltejs/kit';
import type { PageLoad } from '../../$types';
import { createLogoutAttempt } from '$lib/utils/auth';

export const load: PageLoad = async () => {
	// we only use this endpoint for the api
	// and don't need to see the page
	throw redirect(302, '/');
};

export const actions = {
	default({ cookies, locals }) {
		// eat the cookie
		cookies.set('authToken', '', {
			path: '/',
			expires: new Date(0)
		});

		createLogoutAttempt(locals.user.id);

		// redirect the user
		throw redirect(302, '/login');
	}
};
