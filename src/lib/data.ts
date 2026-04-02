export async function fetchAllData() {
  const [res1] = await Promise.all([
    fetch('/data/api_cache.json'),
  ]);

  return {
    visibility: await res1.json()
  };
}
