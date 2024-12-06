import { Bot, Context, session, SessionFlavor } from "@grammyjs/bot";
import { BOT_TOKEN, MY_ID } from "./token.ts";
import { notificationMatch } from "./botModules/listeningWhispers.ts";
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
    if (ctx.chat.type !== "private") {
        return;
      }
    
      ctx.session.stage = "null";
      await ctx.reply("Привет Мир полный вещей!");
});

function containsKeywords(text: string, keywords: string[]): boolean {
    const lowerText = text.toLowerCase();
    return keywords.some((keyword) => lowerText.includes(keyword.toLowerCase()));
  }
  
  // Список ключевых слов
  const keywords = ["велосипед", "ноутбук", "игрушка"];
  
  // Обработчик новых сообщений
  bot.on("message:text", async (ctx) => {
    const messageText = ctx.message.text;
    const messageId = ctx.message.message_id;
    const chatId = ctx.chat.id;
    
    if (containsKeywords(messageText, keywords)) {
        await notificationMatch(ctx, messageText, chatId, messageId);
    }
  });








bot.start();
