import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createBrowserClient, isBrowser } from '@supabase/ssr';

export const load = async ({ fetch, data, depends }) => {
    depends('supabase:auth');

    const supabase = createBrowserClient(
        PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
        global: { fetch },
        cookies: {
            getAll() {
                return data.cookies;
            },
            // Browsers handle cookie setting automatically via the Set-Cookie header.
            setAll(cookiesToSet) {
                if (!isBrowser()) return; // Safety check

                cookiesToSet.forEach(({ name, value, options }) => {
                    // In a browser context, document.cookie is usually enough,
                    // but we often leave this empty as the server handles the actual setting.
                });
            },
        },
    });

    // Make the supabase client available in all child pages data
    return { supabase };
};