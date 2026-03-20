import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getOrCreateUserRecord } from '$lib/server/services/profileService';
import { error } from 'console';

export const load: LayoutServerLoad = async ({ locals }) => {
    const { data: { user } } = await locals.supabase.auth.getUser();

    if (!user) {
        redirect(303, '/auth/login');
    }

    const userRecord = await getOrCreateUserRecord(user);

    if (!userRecord) {
        error(500, 'Something went wrong')
        return
    }

    locals.userRecord = userRecord;

    // Optionally return session data if needed by child routes
    return { userRecord };
};