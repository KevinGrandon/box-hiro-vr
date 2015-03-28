var allBookmarks = [
	{
		url: 'bbc.com'
	},

	{
		url: 'drive.google.com'
	},

	{
		url: 'facebook.com'
	},

	{
		url: 'google.com'
	},

	{
		url: 'live.com'
	},

	{
		url: 'netflix.com'
	},

	{
		url: 'qq.com'
	},

	{
		url: 'sina.com.cn'
	},

	{
		url: 'tumblr.com'
	},

	{
		url: 'vox.com'
	},

	{
		url: 'wordpress.com'
	},

	{
		url: 'yahoo.com'
	},

	{
		url: 'amazon.com'
	},

	{
		url: 'bing.com'
	},

	{
		url: 'dropbox.com'
	},

	{
		url: 'firewatchgame.com'
	},

	{
		url: 'huffingtonpost.com'
	},

	{
		url: 'mail.google.com'
	},

	{
		url: 'nytimes.com'
	},

	{
		url: 'quizlet.com'
	},

	{
		url: 'taobao.com'
	},

	{
		url: 'twitter.com'
	},

	{
		url: 'weibo.com'
	},

	{
		url: 'wordpress.org'
	},

	{
		url: 'yelp.com'
	},

	{
		url: 'baidu.com'
	},

	{
		url: 'buzzfeed.com'
	},

	{
		url: 'economist.com'
	},

	{
		url: 'github.com'
	},

	{
		url: 'linkedin.com'
	},

	{
		url: 'medium.com'
	},

	{
		url: 'pinterest.com'
	},

	{
		url: 'qz.com'
	},

	{
		url: 'tmall.com'
	},

	{
		url: 'vimeo.com'
	},

	{
		url: 'wikipedia.org'
	},

	{
		url: 'yahoo.co.jp'
	},
	{
		url: 'youtube.com'
	}
];

export default class Hotkeys {
	constructor() {
	}

	getAll() {
		return new Promise(resolve => {
			resolve(allBookmarks);
		});
	}
}
