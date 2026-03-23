import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { displayPairingRequest, displays, tenants } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

// Admin pairs a display using a pairing code
export const POST: RequestHandler = async ({ params, request, locals }) => {
    const user = (await locals.safeGetSession()).user
    if (!user) {
        error(401)
    }
    const { displayId } = params;
    const body = await request.json();
    const { pairingCode } = body;

    console.debug(`in pair display, pairing code: ${pairingCode} display Id: ${displayId}`)

    const pairingRequest = await db.query.displayPairingRequest.findFirst({
        where: eq(displayPairingRequest.pairingCode, pairingCode)
    })
    if (!pairingRequest) {
        console.debug('pairing code not found')
        error(404, { message: 'Invalid pairing code' })
    }

    const tenant = await db.query.tenants.findFirst({
        where: (eq(tenants.ownerId, user.id))
    })

    const display = await db.query.displays.findFirst({
        where: (eq(displays.id, displayId))
    })

    if (!display) {
        console.debug('display not found')
        error(401, { message: 'Display not found' })
    }
    if (display.tenantId !== tenant?.id) {
        error(401, { message: '1010' })
    }

    const timestamp = new Date()
    const expireAt = new Date(pairingRequest.createdAt)
    expireAt.setMinutes(expireAt.getMinutes() + 5)

    if (!pairingRequest) {
        console.debug('pairing request not found')
        error(409, { message: 'Invalid pairing code' })
    }
    if (pairingRequest.status !== 'pending') {
        console.debug('invalid pairing request status', pairingRequest.status)
        error(409, { message: 'Invalid pairing code' })
    }
    if (timestamp > expireAt) {
        console.debug('pairing request expired', expireAt)
        error(409, { message: 'Invalid pairing code' })
    }


    const channelId = `pr-${pairingRequest.id}`

    await db.transaction(async (tx) => {
        await tx
            .update(displayPairingRequest)
            .set({
                status: 'paired',
            })
            .where(eq(displayPairingRequest.id, pairingRequest.id))

        await tx
            .update(displays)
            .set({
                status: 'paired',
                statusDate: timestamp,
                pairingRequestId: pairingRequest.id,
                channelId: channelId,
            })
            .where(eq(displays.id, display.id))
    })

    // send message back to display client
    const payload = { displayId: display.id }
    console.log('payload')
    locals.supabase
        .channel(channelId)
        .httpSend("paired", payload)
        .then((resp) => console.log(resp))

    console.debug(`sent 'paired' event, displayId: ${display.id}`)

    return json({ success: true });
};
