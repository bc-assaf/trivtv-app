ALTER TABLE "displays" ALTER COLUMN "status" SET DEFAULT 'offline';--> statement-breakpoint
ALTER TABLE "display-pairing-request" ADD COLUMN "expiresAt" timestamp (0) with time zone;--> statement-breakpoint
ALTER TABLE "display-pairing-request" ADD COLUMN "status" varchar(20) DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "displays" ADD COLUMN "pairingRequestId" uuid;--> statement-breakpoint
ALTER TABLE "displays" ADD COLUMN "sessionKey" uuid;--> statement-breakpoint
ALTER TABLE "displays" ADD CONSTRAINT "displays_pairingRequestId_display-pairing-request_id_fk" FOREIGN KEY ("pairingRequestId") REFERENCES "public"."display-pairing-request"("id") ON DELETE no action ON UPDATE no action;