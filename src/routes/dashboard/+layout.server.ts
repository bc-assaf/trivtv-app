import { redirect } from '@sveltejs/kit';
import { getOrCreateUserProfile } from '$lib/server/services/profileService';
import { error } from 'console';

export const load = async ({ locals }) => {
    const session = await locals.safeGetSession();

    if (!session?.user) {
        redirect(303, '/auth/login');
    }

    const userProfile = await getOrCreateUserProfile(session.user);

    if (!userProfile) {
        error(500, 'Something went wrong')
        return
    }
    // Optionally return session data if needed by child routes
    return { userProfile: userProfile };
};