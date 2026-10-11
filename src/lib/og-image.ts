import { readFile } from 'node:fs/promises';
import { access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import sharp from 'sharp';

const WIDTH = 1200;
const HEIGHT = 630;
const CONTENT_WIDTH = 940;
const require = createRequire(join(process.cwd(), 'package.json'));
const POSTS_DIR = join(process.cwd(), 'src/content/posts');
const DEFAULT_OG_IMAGE = join(process.cwd(), 'public/og/default.png');
const NOTO_SANS_JP_BOLD = require.resolve(
	'@fontsource/noto-sans-jp/files/noto-sans-jp-japanese-700-normal.woff',
);

const fontData = readFile(NOTO_SANS_JP_BOLD);

type CreatePostOgImageOptions = {
	slug: string;
	title: string;
	hasCover: boolean;
};

async function fileExists(path: string) {
	try {
		await access(path, constants.R_OK);
		return true;
	} catch {
		return false;
	}
}

async function findCoverImage(slug: string) {
	for (const extension of ['jpg', 'jpeg', 'png', 'webp']) {
		const path = join(POSTS_DIR, slug, `cover.${extension}`);
		if (await fileExists(path)) {
			return path;
		}
	}

	return DEFAULT_OG_IMAGE;
}

function gradientOverlay() {
	return Buffer.from(`
		<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<linearGradient id="shade-x" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0%" stop-color="#0f172a" stop-opacity="0.78"/>
					<stop offset="58%" stop-color="#0f172a" stop-opacity="0.34"/>
					<stop offset="100%" stop-color="#0f172a" stop-opacity="0.12"/>
				</linearGradient>
				<linearGradient id="shade-y" x1="0" y1="1" x2="0" y2="0">
					<stop offset="0%" stop-color="#0f172a" stop-opacity="0.48"/>
					<stop offset="70%" stop-color="#0f172a" stop-opacity="0"/>
				</linearGradient>
			</defs>
			<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#shade-x)"/>
			<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#shade-y)"/>
		</svg>
	`);
}

async function titleLayer(title: string) {
	const svg = await satori(
		{
			type: 'div',
			props: {
				style: {
					width: `${WIDTH}px`,
					height: `${HEIGHT}px`,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'flex-end',
					padding: '72px 84px',
					boxSizing: 'border-box',
					color: '#ffffff',
					fontFamily: 'Noto Sans JP',
				},
				children: [
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								marginBottom: '28px',
								fontSize: '30px',
								fontWeight: 700,
								letterSpacing: '0px',
								opacity: 0.86,
							},
							children: 'kyoh86.dev',
						},
					},
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								width: `${CONTENT_WIDTH}px`,
								maxHeight: '320px',
								overflow: 'hidden',
								fontSize: '64px',
								fontWeight: 700,
								lineHeight: 1.18,
								letterSpacing: '0px',
								textShadow: '0 8px 32px rgba(15, 23, 42, 0.42)',
							},
							children: title,
						},
					},
				],
			},
		},
		{
			width: WIDTH,
			height: HEIGHT,
			fonts: [
				{
					name: 'Noto Sans JP',
					data: await fontData,
					weight: 700,
					style: 'normal',
				},
			],
		},
	);

	return new Resvg(svg).render().asPng();
}

export async function createPostOgImage({ slug, title, hasCover }: CreatePostOgImageOptions) {
	const background = hasCover ? await findCoverImage(slug) : DEFAULT_OG_IMAGE;
	const titlePng = await titleLayer(title);

	return sharp(background)
		.resize(WIDTH, HEIGHT, { fit: 'cover', position: 'center' })
		.composite([
			{ input: gradientOverlay(), top: 0, left: 0 },
			{ input: titlePng, top: 0, left: 0 },
		])
		.png()
		.toBuffer();
}
