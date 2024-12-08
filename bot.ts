import { Bot, Context, session, SessionFlavor } from "@grammyjs/bot";
import { BOT_TOKEN } from "./config.ts";
import { notificationMatch } from "./botModules/listeningWhispers.ts";
import { botStart } from "./botModules/botStart.ts";
import {
  generateListKeyWordsKeyboard,
  keyWordsKeyboard,
} from "./botStatic/keyboard.ts";
import {
  addKeyWord,
  deleteKeyWordById,
  transferKeyWordsForSearch,
} from "./botKeyWordsDB.ts";


export interface SessionData {
  stage:
    | "addKeyWord"
    | "null";
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
  } else {
    await botStart(ctx);
  }
  ctx.session.stage = "null";
});

function containsKeywords(text: string, keywords: string[]): boolean {
  const lowerText = text.toLowerCase();
  return keywords.some((keyword) => lowerText.includes(keyword.toLowerCase()));
}

// Список ключевых слов

// Обработчик новых сообщений
bot.on("message:text", async (ctx) => {
  if (ctx.chat.type === "group" || ctx.chat.type === "supergroup") {
    const messageText = ctx.message.text;
    const messageId = ctx.message.message_id;
    const chatId = ctx.chat.id;

    const keywords = await transferKeyWordsForSearch();

    if (containsKeywords(messageText, keywords)) {
      await notificationMatch(ctx, messageText, chatId, messageId);
    } 
  } else if (ctx.chat.type === "private") {
    if (ctx.session.stage === "addKeyWord") {
      const keyWordText = ctx.message.text;
      console.log(keyWordText);
      await addKeyWord(keyWordText);
      ctx.session.stage = "null";
      await ctx.reply("Ключевое слово добавлено. Выберите действие:", {
        reply_markup: keyWordsKeyboard,
      });
    }
  }
});


bot.callbackQuery(/^keyWord_/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const keyWordId = ctx.callbackQuery.data.replace("keyWord_", "");
  const previousMessage = ctx.callbackQuery.message?.text;

  if (previousMessage?.includes("для удаления")) {
    await deleteKeyWordById(keyWordId);
    await ctx.reply("Ключевое слово удалено. Выберите действие:", {
      reply_markup: keyWordsKeyboard,
    });
  }
});

bot.callbackQuery("keyWords", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageReplyMarkup({
    reply_markup: keyWordsKeyboard,
  });
});

bot.callbackQuery("addKeyWord", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.stage = "addKeyWord";
  await ctx.reply("Напишите текст ключевого слова:");
});

bot.callbackQuery("deleteKeyWord", async (ctx) => {
  await ctx.answerCallbackQuery();
  const keyboard = await generateListKeyWordsKeyboard();
  await ctx.reply("Выберите ключевое слово для удаления:", {
    reply_markup: keyboard,
  });
});

bot.callbackQuery("viewKeyWords", async (ctx) => {
  await ctx.answerCallbackQuery();
  const keywords = await transferKeyWordsForSearch();
  await ctx.reply("Список ключевых слов:\n\n" + keywords.join("\n"));
});

// bot.start();
export { bot };

