import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

interface AmazonProduct {
	asin: string;
	title?: string;
	detailPageURL?: string;
	image?: {
		url: string;
		width?: number;
		height?: number;
	} | null;
}

interface AmazonProductCache {
	items?: Record<string, AmazonProduct>;
}

let cache: AmazonProductCache | null | undefined;

export function getAmazonProduct(asin: string): AmazonProduct | undefined {
	cache ??= readCache();
	return cache.items?.[asin.toUpperCase()];
}

function readCache(): AmazonProductCache {
	const cachePath = path.join(process.cwd(), '.cache/amazon-products.json');
	if (!existsSync(cachePath)) return {};

	return JSON.parse(readFileSync(cachePath, 'utf8')) as AmazonProductCache;
}
