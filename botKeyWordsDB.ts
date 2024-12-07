import { getKv } from "./botStatic/kvClient.ts";

export interface KeyWord {
  keyWordText: string;
  id: string;
}

export async function addKeyWord(keyWordText: string): Promise<void> {
  const kv = await getKv();
  const keyWordId = `keyWord_${Date.now()}`;
  const keyWord: KeyWord = {
    keyWordText,
    id: keyWordId,
  };
  await kv.set(["hoarderBot", "keyWords", keyWordId], keyWord);
}

export async function deleteKeyWordById(keyWordId: string): Promise<void> {
  const kv = await getKv();
  await kv.delete(["hoarderBot", "keyWords", keyWordId]);
}

async function getKeyWords(): Promise<KeyWord[]> {
  const kv = await getKv();
  const keyWords: KeyWord[] = [];
  const iterator = kv.list<KeyWord>({ prefix: ["hoarderBot", "keyWords"] });

  for await (const entry of iterator) {
    keyWords.push(entry.value);
  }

  return keyWords;
}

export async function transferKeyWords(): Promise<KeyWord[]> {
  return await getKeyWords();
}

export async function transferKeyWordsForSearch(): Promise<string[]> {
  const keyWords = await getKeyWords();
  return keyWords.map((keyWord) => keyWord.keyWordText);
}

export async function transferKeyWordsForView(): Promise<string> {
  const keyWords = await getKeyWords();
  if (keyWords.length === 0) {
    return "Нет активных ключевых слов";
  }

  return keyWords
    .map((keyWord) => `${keyWord.keyWordText}`)
    .join("\n");
}
