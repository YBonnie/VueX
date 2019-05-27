<template>
	<div class="music wow fadeIn" data-wow-duration="3s">
		<!--<div class="header clearfix">
			<div class="fl logoText"><img class="auto-img img" src="../../../server/public/images/logo.jpg" /><span class="span">王者音乐</span></div>
			<div class="fr downBtn"><span>下载APP</span></div>
		</div>-->
		<van-swipe :autoplay="3000">
			<van-swipe-item v-for="(image, index) in images" :key="index">
				<img :src="image.url" class="auto-img"/>
			</van-swipe-item>
		</van-swipe>

		<van-tabs v-model="active" color="#003F96" title-active-color="#003F96" @click="goPath(active)">
			<van-tab v-for="(item,index) in navList" :key="index" :title="item.title">
				<router-view></router-view>
			</van-tab>

		</van-tabs>
	</div>
</template>

<script>
	import animate from '../../node_modules/animate.css'

	import WOW from '../../node_modules/wowjs/dist/wow.js'

	import { Tab, Tabs, Swipe, SwipeItem } from 'vant';

	export default {
		name: 'music',

		data() {
			return {
				//nav的active
				active: 0,

				//navLiat
				navList: [
					{ title: '推荐音乐', path: { name: 'recommendmusic' } },
					{ title: '热歌榜', path: { name: 'hotmusic' } },
					{ title: '搜索', path: { name: 'searchmusic' } }
				],

				images: [
					{ url: 'http://p1.music.126.net/uPNZPd3FIIaCgwzSwAaA4g==/109951164035399075.jpg' },
					{ url: 'http://p1.music.126.net/1GSYTarSwZHQlczD1c-HNA==/109951164034774501.jpg' },
					{ url: 'http://p1.music.126.net/3QxSeuCQw6stEla4FjyjMg==/109951164034756517.jpg' },
					{ url: 'http://p1.music.126.net/UNriQawL_4XEzjxrAEQoIA==/109951164032964653.jpg' },
				]

			}
		},

		methods: {
			goPath(active) {
				for(var i = 0; i < this.navList.length; i++) {
					if(this.active == i) {
						this.$router.push(this.navList[i].path)
					}
				}
				//				this.$router.push(path)
			}

		},

		mounted() {
			new WOW.WOW().init()
		},

		components: {
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
			[Swipe.name]: Swipe,
			[SwipeItem.name]: SwipeItem

		}
	}
</script>

<style lang="less" scoped="scoped">
	.music {
		font-size: 16PX;
		.header {
			width: 100%;
			height: 64PX;
			box-sizing: border-box;
			line-height: 64PX;
			background-color: #003F96;
			padding: 0 .2rem;
			.logoText {
				color: #FFFFFF;
				width: 142px;
				height: 26px;
				text-align: center;
				line-height: 26px;
				position: relative;
				padding: 0;
				margin: 0;
				left: 0;
				top: 19px;
				.img {
					width: 25px;
					height: 25px;
					text-align: center;
					line-height: 25px;
					margin: 0;
					padding: 0;
				}
				.span {
					display: inline-block;
					z-index: 999;
					position: absolute;
					left: 27px;
					top: 0;
					text-align: left;
				}
			}
			.downBtn {
				height: 30PX;
				width: 80PX;
				line-height: 30PX;
				text-align: center;
				border-radius: 15PX;
				color: #FFFFFF;
				border: 1px solid #FFFFFF;
				margin-top: 17PX;
			}
		}
	}
</style>