import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getOrCreateUserRecord } from '$lib/server/services/profileService';

export const load: LayoutServerLoad = async ({ locals }) => {
    const { data: { user } } = await locals.supabase.auth.getUser();

    if (!user) {
        redirect(303, '/auth?mode=login');
    }

    console.log('cp1', user);

    const userRecord = await getOrCreateUserRecord(locals.supabase, user);



    // Optionally return session data if needed by child routes
    return { user, session: locals.session };
};