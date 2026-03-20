import { error, type ServerLoad } from '@sveltejs/kit';
import { db } from '$lib/db';
import { displayPairingRequest } from '$lib/db/schema';

export const load: ServerLoad = async ({ cookies, locals: { supabase }, request, getClientAddress }) => {
    // find a unique pairing code
    let codeExists = true
    let paringCode = ''
    while (codeExists) {
        paringCode = generateRandomCode()
        const { data, error } = await supabase.from('display-pairing-request')
            .select('pairingCode')
            .eq('pairingCode', paringCode)
            .limit(1)

        codeExists = (data && data.length > 0) ?? false
    }

    let pairingRequestId = cookies.get('pairingRequestId') ?? crypto.randomUUID()

    try {
        await db
            .insert(displayPairingRequest)
            .values({
                id: pairingRequestId,
                pairingCode: paringCode,
                ipAddress: getClientAddress(),
            }).onConflictDoUpdate({
                target: [displayPairingRequest.id],
                set: {
                    pairingCode: paringCode,
                    ipAddress: getClientAddress(),
                }
            })
    } catch (e) {
        error(500, `Failed to create pairing request ${e}`)
    }

    // const { data, error: err } = await supabase
    //     .from('display-pairing-request')
    //     .upsert({
    //         id: pairingRequestId,
    //         pairingCode: paringCode,
    //         ipAddress: getClientAddress(),
    //     }, { onConflict: 'id' })
    //     .select()

    cookies.set('pairingRequestId', pairingRequestId ?? '', {
        path: '/',
        httpOnly: true,
        sameSite: 'strict'
    })
    // cookies.set('displayId', displayId ?? '', {
    //     path: '/',
    //     httpOnly: true,
    //     sameSite: 'strict'
    // })

    return {
        pairingRequestId,
        paringCode
    };
};

function generateRandomCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
