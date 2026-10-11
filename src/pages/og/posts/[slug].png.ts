import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { createPostOgImage } from '../../../lib/og-image';

export const getStaticPaths: GetStaticPaths = async () => {
	const posts = await getCollection('posts', ({ data }) => !data.draft);

	return posts.map((post) => ({
		params: { slug: post.id },
		props: { post },
	}));
};

export const GET: APIRoute = async ({ props }) => {
	const { post } = props;
	const png = await createPostOgImage({
		slug: post.id,
		title: post.data.title,
		hasCover: Boolean(post.data.cover),
	});

	return new Response(png, {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	});
};
