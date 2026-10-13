import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const contentDir = path.join(root, 'src/content/posts');
const cachePath = path.join(root, '.cache/amazon-products.json');
const cacheTtlMs = 24 * 60 * 60 * 1000;

await loadEnvFile('.env');
await loadEnvFile('.env.local');

const marketplace = process.env.AMAZON_MARKETPLACE ?? 'www.amazon.co.jp';
const language = process.env.AMAZON_LANGUAGE ?? 'ja_JP';
const partnerTag = process.env.AMAZON_ASSOCIATE_TAG;
const clientId = process.env.AMAZON_CREATORS_CLIENT_ID;
const clientSecret = process.env.AMAZON_CREATORS_CLIENT_SECRET;
const credentialVersion = process.env.AMAZON_CREATORS_CREDENTIAL_VERSION ?? '3.3';

const asins = await findAmazonLinkAsins(contentDir);

if (asins.length === 0) {
	process.exit(0);
}

const existingCache = await readJson(cachePath);
const cachedItems = existingCache?.items ?? {};
const isFresh =
	existingCache?.updatedAt && Date.now() - Date.parse(existingCache.updatedAt) < cacheTtlMs;
const missingAsins = asins.filter((asin) => !cachedItems[asin]);

if (isFresh && missingAsins.length === 0) {
	process.exit(0);
}

if (!clientId || !clientSecret || !partnerTag) {
	console.warn(
		'Amazon product cache was not updated: set AMAZON_CREATORS_CLIENT_ID, AMAZON_CREATORS_CLIENT_SECRET, and AMAZON_ASSOCIATE_TAG.',
	);
	await writeCache({
		...existingCache,
		updatedAt: existingCache?.updatedAt ?? new Date(0).toISOString(),
		marketplace,
		items: cachedItems,
	});
	process.exit(0);
}

const token = await fetchAccessToken({
	clientId,
	clientSecret,
	credentialVersion,
});
const items = { ...cachedItems };

for (const batch of chunk(asins, 10)) {
	const fetched = await fetchItems({
		token,
		itemIds: batch,
		marketplace,
		language,
		partnerTag,
	});

	for (const item of fetched) {
		items[item.asin] = item;
	}
}

await writeCache({
	updatedAt: new Date().toISOString(),
	marketplace,
	items,
});

async function loadEnvFile(filename) {
	const envPath = path.join(root, filename);
	if (!existsSync(envPath)) return;

	const text = await readFile(envPath, 'utf8');
	for (const line of text.split('\n')) {
		const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
		if (!match || process.env[match[1]] !== undefined) continue;

		const value = match[2].replace(/^['"]|['"]$/g, '');
		process.env[match[1]] = value;
	}
}

async function findAmazonLinkAsins(dir) {
	const files = await listFiles(dir);
	const asinPattern = /<AmazonLink\b[^>]*\basin=(?:"([^"]+)"|'([^']+)')/g;
	const found = new Set();

	for (const file of files.filter((file) => /\.(?:md|mdx)$/.test(file))) {
		const text = await readFile(file, 'utf8');
		for (const match of text.matchAll(asinPattern)) {
			found.add((match[1] ?? match[2]).trim().toUpperCase());
		}
	}

	return [...found].sort();
}

async function listFiles(dir) {
	const entries = await import('node:fs/promises').then(({ readdir }) =>
		readdir(dir, { withFileTypes: true }),
	);
	const files = await Promise.all(
		entries.map((entry) => {
			const entryPath = path.join(dir, entry.name);
			return entry.isDirectory() ? listFiles(entryPath) : entryPath;
		}),
	);

	return files.flat();
}

async function fetchAccessToken({ clientId, clientSecret, credentialVersion }) {
	const tokenEndpoint = getTokenEndpoint(credentialVersion);
	const response = await fetch(tokenEndpoint, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			grant_type: 'client_credentials',
			client_id: clientId,
			client_secret: clientSecret,
			scope: 'creatorsapi::default',
		}),
	});

	if (!response.ok) {
		throw new Error(`Amazon Creators API token request failed: ${response.status}`);
	}

	const payload = await response.json();
	return payload.access_token;
}

function getTokenEndpoint(version) {
	if (version === '3.1') return 'https://api.amazon.com/auth/o2/token';
	if (version === '3.2') return 'https://api.amazon.co.uk/auth/o2/token';
	return 'https://api.amazon.co.jp/auth/o2/token';
}

async function fetchItems({ token, itemIds, marketplace, language, partnerTag }) {
	const response = await fetch('https://creatorsapi.amazon/catalog/v1/getItems', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
			'x-marketplace': marketplace,
		},
		body: JSON.stringify({
			itemIds,
			itemIdType: 'ASIN',
			languagesOfPreference: [language],
			marketplace,
			partnerTag,
			resources: ['images.primary.medium', 'itemInfo.title'],
		}),
	});

	if (!response.ok) {
		throw new Error(`Amazon Creators API GetItems request failed: ${response.status}`);
	}

	const payload = await response.json();
	const items = payload.itemResults?.items ?? [];

	return items.map((item) => ({
		asin: item.asin,
		title: item.itemInfo?.title?.displayValue ?? item.asin,
		detailPageURL: item.detailPageURL,
		image: item.images?.primary?.medium ?? null,
	}));
}

async function readJson(filePath) {
	try {
		return JSON.parse(await readFile(filePath, 'utf8'));
	} catch {
		return null;
	}
}

async function writeCache(cache) {
	await mkdir(path.dirname(cachePath), { recursive: true });
	await writeFile(cachePath, `${JSON.stringify(cache, null, 2)}\n`);
}

function chunk(values, size) {
	const chunks = [];
	for (let index = 0; index < values.length; index += size) {
		chunks.push(values.slice(index, index + size));
	}
	return chunks;
}
