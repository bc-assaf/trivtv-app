import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public'
import { createServerClient } from '@supabase/ssr'
import { error, type Handle } from '@sveltejs/kit'


/**
 * Create a request-specific Supabase client, using the user credentials from the request cookie. 
 * - This client is used for server-only code
 * - Check user authentication.
*/

export const handle: Handle = async ({ event, resolve }) => {
    if (event.request.url.startsWith('/tv') || event.request.url.startsWith('/play')) { return resolve(event) }

    event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
        cookies: {
            getAll() {
                return event.cookies.getAll()
            },
            setAll(cookiesToSet) {
                /**
                 * Note: You have to add the `path` variable to the
                 * set and remove method due to sveltekit's cookie API
                 * requiring this to be set, setting the path to an empty string
                 * will replicate previous/standard behavior (https://kit.svelte.dev/docs/types#public-types-cookies)
                 */
                cookiesToSet.forEach(({ name, value, options }) =>
                    event.cookies.set(name, value, { ...options, path: '/' })
                )
            },
        },
    })
    /**
     * Unlike `supabase.auth.getSession()`, which returns the session _without_
     * validating the JWT, this function also calls `getUser()` to validate the
     * JWT before returning the session.
     */
    event.locals.safeGetSession = async () => {
        const {
            data: { session },
        } = await event.locals.supabase.auth.getSession()
        if (!session) {
            return { session: null, user: null }
        }
        const {
            data: { user },
            error,
        } = await event.locals.supabase.auth.getUser()
        if (error) {
            // JWT validation has failed
            return { session: null, user: null }
        }
        return { session, user }
    }

    if (!event.request.url.startsWith('/api')) {
        const session = await event.locals.safeGetSession()
        if (!session.user) {
            console.error("/api access unauthorized")
            throw error(401, 'Unauthorized');
        }
    }

    return resolve(event, {
        filterSerializedResponseHeaders(name) {
            return name === 'content-range' || name === 'x-supabase-api-version'
        },
    })
}