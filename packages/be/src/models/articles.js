/** @param { import("knex").Knex } knex */
export default function (knex) {
	function articleMap(article) {
		article.author = {
			username: article.username,
			bio: article.bio,
			image: article.image,
			following: !!article.following
		};
		delete article.username;
		delete article.bio;
		delete article.image;
		delete article.following;
		article.favorited = article.favorited > 0;
		article.tagList = article.tagList ? article.tagList.split(',') : [];
		article.tagList.sort();
		article.updatedAt = new Date(article.updatedAt).toISOString();
		article.createdAt = new Date(article.createdAt).toISOString();
		return article;
	}

	return {
		getArticle: async function (userId, slug) {
			const query = knex('articles')
				.leftJoin('users', 'articles.author', 'users.id')
				.leftJoin('favorites', 'articles.id', 'favorites.article')
				.leftJoin('favorites as favorites2', function () {
					this.on('favorites2.article', '=', 'articles.id').andOn('favorites2.user', '=', userId);
				})
				.leftJoin('followers', function () {
					this.on('followers.user', '=', 'users.id').andOn('followers.follower', '=', userId);
				})
				.leftJoin('articles_tags', 'articles.id', 'articles_tags.article')
				.leftJoin('tags', 'articles_tags.tag', 'tags.id')
				.where('articles.slug', slug)
				.orderBy('articles.created_at', 'desc');

			query
				.select(
					'articles.id',
					'articles.slug',
					'articles.title',
					'articles.description',
					'articles.body',
					'articles.created_at as createdAt',
					'articles.updated_at as updatedAt'
				)
				.select('users.username', 'users.bio', 'users.image')
				.select(knex.raw('group_concat(distinct tags.name) as tagList'))
				.countDistinct('favorites.id as favoritesCount')
				.count('favorites2.id as favorited')
				.count('followers.id as following')
				.groupBy('articles.id');

			const articles = await query;
			articles.map(articleMap);
			return articles[0] || null;
		},

		createArticle: async function (userId, article) {
			delete article.tagList;
			article.author = userId;
			article.slug = article.title + '-' + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
			await knex('articles').insert(article).returning('id');

			return this.getArticle(userId, article.slug);
		},

		updateArticle: async function (userid, slug, article) {
			if (article.title) {
				article.slug = article.title + '-' + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
			}
			await knex('articles').update(article).where('slug', slug).where('author', userid);
			return this.getArticle(userid, slug);
		},

		deleteArticle: async function (userid, slug) {
			const article = await knex('articles')
				.select('id')
				.where('slug', slug)
				.where('author', userid)
				.first();
			if (!article) {
				return null;
			}

			await Promise.all([
				knex('articles').where('id', article.id).del(),
				knex('favorites').where('article', article.id).del(),
				knex('comments').where('article', article.id).del()
			]);
			return article;
		}
	};
}
