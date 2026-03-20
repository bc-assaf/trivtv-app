import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { displayPairingRequest } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { message } from 'valibot';

export const POST: RequestHandler = async ({ params, request, locals }) => {
    const { displayId } = params;

    const body = await request.json();
    const { pairingCode } = body;


    console.log('in action:', pairingCode, displayId)

    const [pr] = await db
        .select()
        .from(displayPairingRequest)
        .where(eq(displayPairingRequest.pairingCode, pairingCode))

    if (!pr) {
        error(409, { message: 'Invalid pairing code' })
    }

    const channelId = `pr-${pr.id}`

    locals.supabase
        .channel(channelId)
        .httpSend("paired", { message: 'hello' })
        .then((resp) => console.log(resp))



    console.log('sent message to  ', channelId)

    return json({ success: true });
};
