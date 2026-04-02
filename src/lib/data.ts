export async function fetchAllData() {
  const [res1, res2] = await Promise.all([
    fetch('/data/api_cache.json'),
  ]);

  if (!res1.ok || !res2.ok) {
    throw new Error('Failed to load data');
  }

  return {
    visibility: await res1.json(),
    longData: await res2.json(),
  };
}
