import { pgTable, uuid, varchar, timestamp, primaryKey, uniqueIndex } from 'drizzle-orm/pg-core';

export const profiles = pgTable('profiles', {
	id: uuid().primaryKey(),
	email: varchar({ length: 255 }).notNull().unique(),
	displayName: varchar({ length: 40 }).notNull()
});

export const tenants = pgTable('tenants', {
	id: uuid().primaryKey().defaultRandom(),
	displayName: varchar({ length: 60 }).notNull(),
	createAt: timestamp({ withTimezone: true, precision: 0 }).notNull().defaultNow(),
	ownerId: uuid()
		.notNull()
		.references(() => profiles.id),
	subscriptionType: varchar({ length: 20 }).notNull(),
	expireAt: timestamp({ withTimezone: true, precision: 0 })
});

export const tenantProfiles = pgTable('tenant-profiles', {
	profileId: uuid()
		.notNull()
		.references(() => profiles.id, { onDelete: 'cascade' }),
	tenantId: uuid()
		.notNull()
		.references(() => tenants.id, { onDelete: 'cascade' }),
	role: varchar({ length: 20 }).default('member'),
	createdAt: timestamp({ withTimezone: true }).defaultNow()
}, (t) => [
	primaryKey({ columns: [t.profileId, t.tenantId] })
])

export const displays = pgTable('displays', {
	id: uuid().primaryKey().defaultRandom(),
	tenantId: uuid().notNull().references(() => tenants.id, { onDelete: 'cascade' }),
	displayName: varchar({ length: 40 }).notNull(),
	status: varchar({ length: 20 }).notNull(),
	statusDate: timestamp({ withTimezone: true, precision: 0 }).notNull(),
	channelId: varchar({ length: 50 }),
})

export const displayPairingRequest = pgTable('display-pairing-request', {
	id: uuid().primaryKey().defaultRandom(),
	pairingCode: varchar({ length: 10 }).notNull(),
	ipAddress: varchar({ length: 20 }).notNull(),
	createAt: timestamp({ withTimezone: true, precision: 0 }).notNull().defaultNow()
}, (t) => [
	uniqueIndex('ux_pairing_code').on(t.pairingCode)
])
