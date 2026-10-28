#!/usr/bin/env node
/**
 * IndexNow Ping Utility
 * Automatically notifies Yandex and Bing whenever pages are updated.
 */

const HOST = 'angrove.ru';
const KEY = 'c8f2a1b94e7d03f69182ab47dc0e561f';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const URLS = [
  `https://${HOST}/`
];

async function submitIndexNow(endpoint) {
  try {
    const payload = {
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList: URLS
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent': 'IndexNow-Ping/1.0'
      },
      body: JSON.stringify(payload)
    });

    console.log(`[IndexNow] ${endpoint} -> HTTP ${res.status} ${res.statusText}`);
    return res.status;
  } catch (err) {
    console.error(`[IndexNow Error] Failed to ping ${endpoint}:`, err.message);
    return null;
  }
}

async function main() {
  console.log(`[IndexNow] Submitting ${URLS.length} URLs to search engines...`);
  await submitIndexNow('https://yandex.com/indexnow');
  await submitIndexNow('https://api.indexnow.org/indexnow');
  console.log('[IndexNow] Submission complete.');
}

main();
