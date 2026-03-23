import { error, json } from '@sveltejs/kit';
import { db } from '$lib/db';
import { displayPairingRequest, displays } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from '@sveltejs/kit';

// Start display session
export const POST: RequestHandler = async ({ params, request, cookies }) => {
    const { displayId } = params;
    const body = await request.json();
    const { pairingRequestId } = body;

    console.debug(`In create session. Display ${displayId}, Request ${pairingRequestId}`)

    const pairingRecord = await db.query.displayPairingRequest.findFirst({
        where: eq(displayPairingRequest.id, pairingRequestId)
    })

    if (!pairingRecord || pairingRecord.status !== 'paired') {
        error(401, { message: 'Unauthorized' })
    }

    const display = await db.query.displays.findFirst({
        where: eq(displays.id, displayId!),
    })

    if (!display) {
        error(404, 'Display not found')
    }
    if (display.status !== 'paired' || display.pairingRequestId !== pairingRequestId) {
        error(401, 'Invalid pairing')
    }

    const sessionKey = crypto.randomUUID()

    await db.transaction(async (tx) => {
        await tx
            .update(displays)
            .set({
                status: 'connected',
                sessionKey: sessionKey,
                pairingRequestId: null,
            })
            .where(eq(displays.id, display.id))

        await tx
            .delete(displayPairingRequest)
            .where(eq(displayPairingRequest.id, pairingRecord.id))

    })

    cookies.set('session-key', sessionKey, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 365 // 365 days
    })

    return json({ success: true })
};
