import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
    const { data: { user } } = await locals.supabase.auth.getUser();

    if (!user) {
        redirect(303, '/auth?mode=login');
    }

    // Optionally return session data if needed by child routes
    return { user, session: locals.session };
};