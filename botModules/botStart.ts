import { MyContext } from "../bot.ts";
import { startKeyboard } from "../botStatic/keyboard.ts";
import { ADMIN_ID } from "../token.ts";

export async function botStart(ctx: MyContext) {
  const userId = ctx.from?.id;

  if (userId) {
    if (userId === Number(ADMIN_ID)) {
      await ctx.reply("Главное меню", {
        reply_markup: startKeyboard,
      });
    } else {
      await ctx.reply("У вас нет доступа к этому боту");
      return;
    }
  }
}
