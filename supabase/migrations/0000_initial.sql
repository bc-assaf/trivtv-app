CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"displayName" varchar(40) NOT NULL,
	CONSTRAINT "profiles_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "tenant-profiles" (
	"profileId" uuid NOT NULL,
	"tenantId" uuid NOT NULL,
	"role" varchar(20) DEFAULT 'member',
	"createdAt" timestamp with time zone DEFAULT now(),
	CONSTRAINT "tenant-profiles_profileId_tenantId_pk" PRIMARY KEY("profileId","tenantId")
);
--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"displayName" varchar(60) NOT NULL,
	"createAt" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"ownerId" uuid NOT NULL,
	"subscriptionType" varchar(20) NOT NULL,
	"expireAt" timestamp (0) with time zone
);
--> statement-breakpoint
ALTER TABLE "tenant-profiles" ADD CONSTRAINT "tenant-profiles_profileId_profiles_id_fk" FOREIGN KEY ("profileId") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenant-profiles" ADD CONSTRAINT "tenant-profiles_tenantId_tenants_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_ownerId_profiles_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;