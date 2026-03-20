import { db } from '$lib/db';
import { displays, tenants, displayPairingRequest } from '$lib/db/schema';
import type { ServerLoad } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions } from './$types';
import { fail, superValidate } from 'sveltekit-superforms';

export const load: ServerLoad = async ({ locals }) => {
    var { data, error } = await locals.supabase.auth.getUser()

    const tenantId = await db
        .select({
            id: tenants.id,
        })
        .from(tenants)
        .where(eq(tenants.ownerId, data.user!.id))
        .limit(1)
        .then(res => res[0])

    const displayList = await db
        .select()
        .from(displays)
        .where(eq(displays.tenantId, tenantId.id))
        .orderBy(displays.displayName)

    return ({ displays: displayList })
}

export const actions = {
    pair: async ({ request }) => {

        const data = await request.formData();
        const pairingCode = data.get('pairingCode') as string
        const displayId = data.get('displayId')
        console.log('in action:', pairingCode, displayId)

        const pr = await db
            .select()
            .from(displayPairingRequest)
            .where(eq(displayPairingRequest.pairingCode, pairingCode))

        if (!pr || pr.length === 0) {
            console.error('Invalid pairing code')
            return fail(409, { message: 'Invalid pairing code' })
        }

        // console.log('found pairing request', pr)
        return { success: true }

    }

} satisfies Actions;
