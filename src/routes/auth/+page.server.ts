import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { AuthApiError } from '@supabase/supabase-js';

export const load: PageServerLoad = async ({ locals }) => {
    const { data: { session } } = await locals.supabase.auth.getSession();
    // trying to access the auth page while signed in -> go to /admin
    if (session) {
        throw redirect(303, '/admin');
    }
    return { user: locals.user }
};

export const actions = {
    login: async ({ locals: { supabase }, url, request }) => {
        const formData = await request.formData()

        const { data, error: err } = await supabase.auth.signInWithPassword({
            email: formData.get('email') as string,
            password: formData.get('password') as string,
        })

        if (err) {
            if (err instanceof AuthApiError && err.status === 400) {
                return fail(400, {
                    message: "Invalid email or password"
                })
            } else {
                return fail(500, {
                    message: "Server error. Try again later."
                })
            }
        }

        redirect(303, "/admin")
    },
    register: async ({ locals: { supabase }, request }) => {
        const formData = await request.formData()

        const { data, error } = await supabase.auth.signUp({
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            options: {
                data: {
                    displayName: 'display name',
                },
                emailRedirectTo: 'https://trivtv.com/admin',
            },
        })

        return { success: true }

    }
} satisfies Actions;
