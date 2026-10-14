import * as SecureStore from 'expo-secure-store';

// SecureStore values are limited to about 2 KB and a Supabase session can be larger,
// so values are split into chunks stored under indexed keys.
const CHUNK_SIZE = 1800;

const countKey = (key: string) => `${key}.chunks`;
const chunkKey = (key: string, i: number) => `${key}.${i}`;

async function removeItem(key: string): Promise<void> {
  const count = Number(await SecureStore.getItemAsync(countKey(key)));
  for (let i = 0; i < count; i++) await SecureStore.deleteItemAsync(chunkKey(key, i));
  await SecureStore.deleteItemAsync(countKey(key));
}

async function getItem(key: string): Promise<string | null> {
  const count = Number(await SecureStore.getItemAsync(countKey(key)));
  if (!count) return null;
  const parts: string[] = [];
  for (let i = 0; i < count; i++) {
    const part = await SecureStore.getItemAsync(chunkKey(key, i));
    if (part === null) return null;
    parts.push(part);
  }
  return parts.join('');
}

async function setItem(key: string, value: string): Promise<void> {
  await removeItem(key);
  const count = Math.ceil(value.length / CHUNK_SIZE);
  for (let i = 0; i < count; i++) {
    await SecureStore.setItemAsync(
      chunkKey(key, i),
      value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
    );
  }
  await SecureStore.setItemAsync(countKey(key), String(count));
}

export const secureStorage = { getItem, setItem, removeItem };
