import { Bot, Context, session, SessionFlavor } from "@grammyjs/bot";
import { BOT_TOKEN } from "./token.ts";

export interface SessionData {
  stage:
    | "anonMessage"
    | "askName"
    | "askBirthDate"
    | "null"
    | "addUser"
    | "addTask";
}

export type MyContext = Context & SessionFlavor<SessionData>;

const bot = new Bot<MyContext>(BOT_TOKEN);

bot.use(session({
  initial: (): SessionData => ({
    stage: "null",
  }),
}));

bot.command("start", async (ctx) => {
  await ctx.reply("Привет Мир полный вещей!");
});










bot.start();
