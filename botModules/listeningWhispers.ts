import { MyContext } from "../bot.ts";
import { MY_ID } from "../token.ts";
export async function notificationMatch(ctx: MyContext, messageText: string, chatId: number, messageId: number) {
    console.log("🔑 Ключевое слово найдено!");
    // Создаем ссылку на сообщение
    const messageLink = `https://t.me/c/${chatId.toString().replace('-100', '')}/${messageId}`;
    const message = `Найдено совпадение!\nСообщение: "${messageText}"\nСсылка: ${messageLink}`;

    try {
        await ctx.api.sendMessage(MY_ID, message, {
            parse_mode: "HTML",
        });
    } catch (error) {
        console.error("Ошибка при отправке сообщения:", error);
    }
}