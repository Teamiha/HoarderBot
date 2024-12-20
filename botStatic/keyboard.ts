import { InlineKeyboard } from "@grammyjs/bot";
import { KeyWord } from "../botKeyWordsDB.ts";
import { transferKeyWords } from "../botKeyWordsDB.ts";

export const startKeyboard = new InlineKeyboard()
  .text("Настройка ключевых слов", "keyWords");

export const keyWordsKeyboard = new InlineKeyboard()
  .text("Добавить ключевое слово", "addKeyWord")
  .row()
  .text("Удалить ключевое слово", "deleteKeyWord")
  .row()
  .text("Просмотр ключевых слов", "viewKeyWords");

export async function generateListKeyWordsKeyboard(): Promise<InlineKeyboard> {
  const keyboard = new InlineKeyboard();
  const keyWords = await transferKeyWords();

  keyWords.forEach((keyWord: KeyWord) => {
    const displayText = `${keyWord.keyWordText}`;
    keyboard.text(displayText, `keyWord_${keyWord.id}`);
    keyboard.row();
  });

  return keyboard;
}
