import { db } from '$lib/db';
import { profiles, tenants, tenantProfiles, displays } from '$lib/db/schema';
import type { UserProfile } from '$lib/types/user-profile';
import type { User } from '@supabase/supabase-js';
import { eq } from 'drizzle-orm'


export const getOrCreateUserProfile = async (user: User): Promise<UserProfile | undefined> => {
    if (!user.id || !user.email || !user.user_metadata?.displayName) {
        throw new Error('User id, email, or displayName is missing');
    }

    const [result] = await db
        .select()
        .from(profiles)
        .leftJoin(tenants, eq(tenants.ownerId, profiles.id))
        .where(eq(profiles.id, user.id))
        .limit(1)

    const profile = result?.profiles;
    const tenant = result?.tenants; // This is typed as 'Tenant | null' because of the left join

    if (profile && tenant) return {
        userId: user.id,
        email: user.email,
        displayName: profile.displayName,
        tenantId: tenant.id,
        tenantName: tenant.displayName
    }

    const expireAt = new Date()
    expireAt.setDate(expireAt.getDate() + 14)

    if (profile && !tenant) {
        await db.transaction(async (tx) => {
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

            await tx.insert(displays)
                .values({
                    tenantId: newTenant.id,
                    displayName: 'TV no. 1',
                    status: 'offline',
                    statusDate: new Date()
                })
                .returning()


            return {
                userId: user.id,
                email: user.email,
                displayName: profile.displayName,
                tenantId: newTenant.id,
                tenantName: newTenant.displayName
            }
        })
    } else {
        // Create both profile and tenant
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

            await tx.insert(displays)
                .values({
                    tenantId: newTenant.id,
                    displayName: 'TV no. 1',
                    status: 'offline',
                    statusDate: new Date()
                })
                .returning()

            return {
                userId: user.id,
                email: user.email,
                displayName: newProfile.displayName,
                tenantId: newTenant.id,
                tenantName: newTenant.displayName
            }
        })
    }
}
