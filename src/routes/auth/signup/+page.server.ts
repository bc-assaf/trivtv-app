import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import * as v from 'valibot'
import { setError, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

const signupSchema = v.pipe(
    v.object({
        email: v.pipe(v.string('Email is required'), v.email('Invalid email address'), v.maxLength(64, 'Email must be at most 64 characters')),
        displayName: v.pipe(v.string('Display name is required'), v.minLength(1, "Display Name is required"), v.maxLength(40, 'Display Name must be at most 40 characters')),
        password: v.pipe(v.string('Password is required'), v.minLength(8, 'Password must be at least 8 characters')),
        confirmPassword: v.pipe(v.string('Please confirm your password')),
        agreeToTerms: v.pipe(v.boolean(), v.literal(true, 'You must agree to the terms of service')),
    }),
    v.forward(
        v.check((input) => input.password === input.confirmPassword, "Passwords do not match"), ['confirmPassword'])
);


export const load = async ({ locals }) => {
    const session = await locals.safeGetSession();

    // trying to access the auth page while signed in -> go to /dashboard
    if (session?.user) {
        throw redirect(303, '/dashboard');
    }

    const form = await superValidate(valibot(signupSchema));

    return { form }
};

export const actions = {
    default: async ({ locals: { supabase }, request }) => {
        const form = await superValidate(request, valibot(signupSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        const { data, error } = await supabase.auth.signUp({
            email: form.data.email,
            password: form.data.password,
            options: {
                data: {
                    displayName: form.data.displayName,
                },
                emailRedirectTo: 'https://trivtv.com/dashboard',
            },
        })


        if (error) {
            return setError(form, '', 'Sign up failed. ' + error.message);
        }

        redirect(303, "/dashboard")
    }

} satisfies Actions;
