import { redirect } from '@sveltejs/kit';
import { getOrCreateUserProfile } from '$lib/server/services/profileService';
import { error } from 'console';
import type { LayoutServerLoad } from '../$types';

export const load: LayoutServerLoad = async ({ locals }) => {
    const { session, user } = await locals.safeGetSession();

    if (!session?.user) {
        redirect(303, '/auth/login');
    }

    const userProfile = await getOrCreateUserProfile(user!);

    if (!userProfile) {
        error(500, 'Something went wrong')
        return
    }
    // Return data needed by child routes
    return { userProfile: userProfile, session: session };
};