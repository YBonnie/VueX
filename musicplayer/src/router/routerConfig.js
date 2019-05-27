import routerComponents from './routerComponents.js'

export default [

	{
		path: '/',
		name: 'index',
		component: routerComponents.index
	},
	{
		path: '/main',
		name: 'main',
		component: routerComponents.main,
		children: [{
				path: '/music',
				name: 'music',
				component: routerComponents.music,
				children: [{
						path: '/recommendmusic',
						name: 'recommendmusic',
						component: routerComponents.recommendmusic
					},

					{
						path: '/hotmusic',
						name: 'hotmusic',
						component: routerComponents.hotmusic
					},

					{
						path: '*',
						redirect: { name: 'recommendmusic' }
					}
				]
			},
			{
				path: '/mymusic',
				name: 'mymusic',
				component: routerComponents.mymusic
			},

			{
				path: '/musiclist',
				name: 'musiclist',
				component: routerComponents.musiclist
			},

			{
				path: '/video',
				name: 'Video',
				component: routerComponents.video
			},

			{
				path: '*',
				redirect: { name: 'recommendmusic' }
			}

		]
	},
	{
		path: '/searchmusic',
		name: 'searchmusic',
		component: routerComponents.searchmusic
	},
	{
		path: '/frineds',
		name: 'friends',
		component: routerComponents.friends
	},
	{
		path: '/collectmusic',
		name: 'collectmusic',
		component: routerComponents.collectmusic
	},
	{
		path: '/register',
		name: 'register',
		component: routerComponents.register
	},
	{
		path: '/login',
		name: 'login',
		component: routerComponents.login
	},
	{
		path: '/player',
		name: 'player',
		component: routerComponents.player,
	},

]