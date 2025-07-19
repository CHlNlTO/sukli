// src/app/api/webhooks/clerk/route.ts
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";

export async function POST(req: Request) {
  // Get the webhook secret from environment
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET to your environment variables"
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.text();

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  console.log("Webhook received:", eventType, evt.data);

  if (eventType === "user.created") {
    try {
      const { id, email_addresses, first_name, last_name } = evt.data;

      // Create user profile in Supabase using the admin client
      const { data, error } = await supabaseAdmin
        .from("user_profiles")
        .insert({
          clerk_user_id: id,
          email: email_addresses[0]?.email_address || "",
          first_name: first_name || null,
          last_name: last_name || null,
          default_currency: "PHP",
          theme_preference: "clarity",
          custom_theme_config: {},
        })
        .select();

      if (error) {
        console.error("Error creating user profile:", error);
        return new Response("Error creating user profile", { status: 500 });
      }

      console.log("User profile created successfully:", data);
      return new Response("User profile created", { status: 200 });
    } catch (error) {
      console.error("Error processing webhook:", error);
      return new Response("Error processing webhook", { status: 500 });
    }
  }

  return new Response("Webhook processed", { status: 200 });
}
