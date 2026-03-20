CREATE TABLE "display-pairing-request" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pairingCode" varchar(10) NOT NULL,
	"ipAddress" varchar(20) NOT NULL,
	"createAt" timestamp (0) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "displays" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenantId" uuid NOT NULL,
	"displayName" varchar(40) NOT NULL,
	"status" varchar(20) NOT NULL,
	"statusDate" timestamp (0) with time zone NOT NULL,
	"channelId" varchar(50)
);
--> statement-breakpoint
ALTER TABLE "displays" ADD CONSTRAINT "displays_tenantId_tenants_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "ux_pairing_code" ON "display-pairing-request" USING btree ("pairingCode");