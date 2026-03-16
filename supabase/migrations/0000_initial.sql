CREATE TABLE "tenant-users" (
	"userId" uuid NOT NULL,
	"tenantId" uuid NOT NULL,
	"role" varchar(20) DEFAULT 'member',
	"createdAt" timestamp with time zone DEFAULT now(),
	CONSTRAINT "tenant-users_userId_tenantId_pk" PRIMARY KEY("userId","tenantId")
);
--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"displayName" varchar(50) NOT NULL,
	"createAt" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"ownerId" uuid NOT NULL,
	"subscriptionType" varchar(20) NOT NULL,
	"expireAt" timestamp (0) with time zone
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"displayName" varchar(40) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "tenant-users" ADD CONSTRAINT "tenant-users_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenant-users" ADD CONSTRAINT "tenant-users_tenantId_tenants_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_ownerId_users_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;