export const BOT_TOKEN = Deno.env.get("BOT_TOKEN") || "";
export const ADMIN_ID = Deno.env.get("ADMIN_ID") || "";

if (!BOT_TOKEN) {
    throw new Error("BOT_TOKEN environment variable is required");
  }

if (!ADMIN_ID) {
  throw new Error("ADMIN_ID environment variable is required");
}
    