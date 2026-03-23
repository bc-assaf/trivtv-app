import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { AuthApiError } from '@supabase/supabase-js';
import * as v from 'valibot'
import { setError, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

const loginSchema = v.object({
    email: v.pipe(v.string('Email is required'), v.email('Invalid email address')),
    password: v.pipe(v.string('Password is required'), v.minLength(1, 'Password is required')),
});

export const load = async ({ locals }) => {
    const session = await locals.safeGetSession();

    // trying to access the auth page while signed in -> go to /dashboard
    if (session?.user) {
        throw redirect(303, '/dashboard');
    }
    const form = await superValidate(valibot(loginSchema));

    return { form }
};

export const actions = {
    default: async ({ locals: { supabase }, request }) => {
        const form = await superValidate(request, valibot(loginSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        const { error: err } = await supabase.auth.signInWithPassword({
            email: form.data.email,
            password: form.data.password,
        })


        if (err) {

            if (err instanceof AuthApiError && err.status === 400) {
                return setError(form, '', 'Invalid email or password');
            } else {
                return fail(500, {
                    form,
                    message: "Server error. Try again later."
                });
            }
        }

        redirect(303, "/dashboard")
    },
} satisfies Actions;
