import type { PageServerLoad } from './$types'

export const load = async ({ cookies }) => {
    const sessionKey = cookies.get('session-key')

    console.log('session key', sessionKey)

    return { sessionKey: sessionKey }

}