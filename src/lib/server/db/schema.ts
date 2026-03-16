import { pgTable, uuid, varchar, timestamp, primaryKey } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: uuid().primaryKey().defaultRandom(),
	email: varchar({ length: 255 }).notNull().unique(),
	displayName: varchar({ length: 40 }).notNull()
});

export const tenants = pgTable('tenants', {
	id: uuid().primaryKey().defaultRandom(),
	displayName: varchar({ length: 50 }).notNull(),
	createAt: timestamp({ withTimezone: true, precision: 0 }).notNull().defaultNow(),
	ownerId: uuid()
		.notNull()
		.references(() => users.id),
	subscriptionType: varchar({ length: 20 }).notNull(),
	expireAt: timestamp({ withTimezone: true, precision: 0 })
});

export const tenantUsers = pgTable('tenant-users', {
	userId: uuid()
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	tenantId: uuid()
		.notNull()
		.references(() => tenants.id, { onDelete: 'cascade' }),
	role: varchar({ length: 20 }).default('member'),
	createdAt: timestamp({ withTimezone: true }).defaultNow()
}, (t) => [
	primaryKey({ columns: [t.userId, t.tenantId] })
])