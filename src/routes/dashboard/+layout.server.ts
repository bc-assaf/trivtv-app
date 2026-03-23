import { redirect } from '@sveltejs/kit';
import { getOrCreateUserRecord } from '$lib/server/services/profileService';
import { error } from 'console';

export const load = async ({ locals }) => {
    const session = await locals.safeGetSession();

    if (!session?.user) {
        redirect(303, '/auth/login');
    }

    const userRecord = await getOrCreateUserRecord(session.user);

    if (!userRecord) {
        error(500, 'Something went wrong')
        return
    }
    // Optionally return session data if needed by child routes
    return { userRecord };
};