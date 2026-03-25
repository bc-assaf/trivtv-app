// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Session, SupabaseClient, User } from '@supabase/supabase-js'
import type { Database } from '$lib/db/database.types'
import type { UserProfile } from '$lib/types/user-profile';


declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient<Database>
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>
			// session: Session | null
			// user: User | null
			// userProfile: UserProfile | null
		}
		interface PageData {
			session: Session | null
			// user: User | null
			userProfile: UserProfile

		}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
