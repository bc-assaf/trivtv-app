import { db } from '$lib/db';
import { profiles, tenants, tenantProfiles } from '$lib/db/schema';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { eq } from 'drizzle-orm'

export const getOrCreateUserRecord = async (supabase: SupabaseClient, user: User) => {
    const [userRecord] = await db.select()
        .from(profiles)
        .leftJoin(tenants, eq(tenants.ownerId, profiles.id))
        .where(eq(profiles.id, user.id))

    console.debug('in getOrCreateUserRecord', userRecord)

    if (userRecord && userRecord.tenants) return { profile: userRecord, tenant: [userRecord.tenants] }

    if (!user.id || !user.email || !user.user_metadata?.displayName) {
        throw new Error('User id, email, or displayName is missing');
    }

    const expireAt = new Date()
    expireAt.setDate(expireAt.getDate() + 14)

    if (userRecord && !userRecord.tenants) {
        const tx = await db.transaction(async (tx) => {
            // Create only tenant
            const [newTenant] = await tx.insert(tenants)
                .values({
                    displayName: `${user.user_metadata.displayName}'s Organization`,
                    ownerId: user.id, // Linking them
                    subscriptionType: 'basic',
                    expireAt: expireAt
                })
                .returning()

            await tx.insert(tenantProfiles)
                .values({
                    profileId: user.id,
                    tenantId: newTenant.id,
                    role: 'owner'
                })
                .returning()

            return { profile: userRecord, tenant: newTenant }
        })
    } else {
        // Create both user and tenant
        const tx = await db.transaction(async (tx) => {
            const [newProfile] = await tx.insert(profiles)
                .values({
                    id: user.id!, // The UUID from Supabase Auth
                    email: user.email!,
                    displayName: user.user_metadata.displayName,
                }).returning();

            const [newTenant] = await tx.insert(tenants)
                .values({
                    displayName: `${user.user_metadata.displayName}'s Organization`,
                    ownerId: user.id, // Linking them
                    subscriptionType: 'basic',
                    expireAt: expireAt
                })
                .returning()

            await tx.insert(tenantProfiles)
                .values({
                    profileId: user.id,
                    tenantId: newTenant.id,
                    role: 'owner'
                })
                .returning()

            return { profile: newProfile, tenant: newTenant }
        })
    }
}
