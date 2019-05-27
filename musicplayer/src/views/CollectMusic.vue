<template>
	<div class="collectMusic animated fadeIn" data-wow-duration="3s">

		<van-nav-bar title="我的收藏" left-arrow @click-left="onClickLeft" @click-right="onClickRight">
			<i class="iconfont icon-iconset0157" slot="right"></i>
		</van-nav-bar>

		<van-search v-model="searchValue" :class="searchActive" v-if="searchShow" placeholder="请输入搜索关键词" show-action shape="round" @search="onSearch(searchValue)">
			<div slot="action" @click="onSearch">搜索</div>
		</van-search>

		<!--#003F96-->
		<van-tabs v-model="active" color="#003F96" title-active-color="#003F96" :swipeable="true" :animated="true">
			<van-tab title="专辑">内容 1</van-tab>
			<van-tab title="歌曲">
				<div v-if="collectActive1" class="text">您没有收藏的歌曲哦</div>
				<van-list v-if="collectActive2" v-model="loading" class="songlist" :finished="finished" finished-text="没有更多了" @load="onLoad">
					<van-row class="listBox" v-for="(item,index) in loveSongs" :key="index" @click.native="goPath(item)">
						<div class="wow animated fadeIn" data-wow-duration="5s">
							<van-col span="4" class="index">{{index+1}}</van-col>
							<van-col span="16">
								<van-row>
									<van-col span="24" class="songName">{{item.name}}</van-col>
									<van-col span="24" class="songAuthor">{{item.singer}}</van-col>
								</van-row>
							</van-col>
							<van-col span="4" class="icon"><i class="iconfont icon-bofang"></i></van-col>
						</div>
					</van-row>
				</van-list>
			</van-tab>
			<van-tab title="视频">
				<div v-if="collectVideo1" class="text">您没有收藏的MV哦</div>
				<van-row class="videoBox">
					<van-col span="12" class="box" v-for="(item,index) in loveVideo" :key="index">
						<div class="video" @click="PopupVideo(item)">
							<img class="auto-img" :src="item.pic" alt="" />
							<span class="listerncount"><i class="iconfont icon-erji"></i> {{item.playCount}}</span>
							<span class="singer"><i class="iconfont icon-geshou"></i> {{item.singer}}</span>
							<span class="like"><i class="iconfont icon-aixin1"></i> {{item.playCount}}</span>
						</div>
						<p class="name">{{item.name}}</p>
					</van-col>
				</van-row>

				<van-popup v-model="videoShow" @click-overlay="pause">

					<video ref="video" :src="url" class="auto-img" @click="videoPlay" controls="controls"></video>

				</van-popup>

			</van-tab>
		</van-tabs>

		<div class="miniPlayer" v-if="show">
			<div class="playerBox">
				<van-row>
					<van-col span="4" class="image">
						<div class="imageBox" @click="goStatus">
							<img :src="songItem.pic" class="auto-img" />
						</div>
					</van-col>
					<van-col span="20">
						<van-col span="24">
							<van-slider v-model="value" class="progress" @change="changeValue(value)" active-color="#FFFF00">
								<div ref="button" slot="button" class="custom-button">
								</div>
							</van-slider>
						</van-col>
						<van-col span="24" class="controlStop">
							<span class="fl singer">{{songItem.singer}}</span>
							<span class="iconfont icon-bofang" @click="controlMusic"></span>
							<span class="iconfont icon-caidan"></span>
						</van-col>
					</van-col>

				</van-row>
			</div>
			<audio ref="audio" :src="songItem.url" autoplay="autoplay"></audio>
		</div>
	</div>
</template>

<script>
	import animate from '../../node_modules/animate.css'

	import WOW from '../../node_modules/wowjs/dist/wow.js'

	import { List, NavBar, Tab, Tabs, Row, Col, Slider, Search, Popup, Toast } from 'vant';

	export default {
		name: 'collectmusic',

		data() {
			return {
				loveSongs: [],
				//导航的active
				active: 1,
				//列表懒加载的内容
				loading: false,
				finished: false,

				show: false,

				songItem: [],

				//滑块的value
				value: 0,

				play: true,
				//播放时间
				time: 0,
				//歌曲总时长
				allTime: 0,

				audio: null,
				//定时器
				timer: null,
				//查询框是否显示
				searchShow: false,
				//查询的值
				searchValue: '',

				searchActive: '',

				//是否存在收藏的歌曲
				collectActive1: false,
				collectActive2: false,

				//当前已经收藏的Mv
				loveVideo: [],
				//是否有收藏的MV
				collectVideo1: false,
				collectVideo2: false,

				videoShow: false,
				//mv地址
				url: '',
				//video是否播放
				playing: false,

			}
		},

		methods: {
			//返回按钮
			onClickLeft() {
				this.$router.go(-1)
			},
			//查询按钮
			onClickRight() {
				this.searchShow = !this.searchShow
				this.searchActive = this.searchShow ? 'animated zoomIn' : 'animated zoomOut'
				console.log('vdv')
			},

			onLoad() {
				// 异步更新数据
				setTimeout(() => {
					// 加载状态结束
					this.loading = false;

					// 数据全部加载完成
					if(this.loveSongs.length >= this.loveSongs.length) {
						this.finished = true;
					}
				}, 500);
			},
			goStatus() {
				clearInterval(this.timer)
				this.$router.push({ name: 'player', params: { songItem: this.songItem, time: this.$refs.audio.currentTime } })
			},

			//获取当前播放歌曲的内容
			goPath(item) {
				clearInterval(this.timer)
				this.$store.commit('getSongItem', item)

				this.show = true

				this.songItem = this.$store.state.songItem

				if(this.show) {
					this.timer = setInterval(this.getTime, 1000)
				}

				this.$store.commit('getPlay', this.show)
			},

			controlMusic() {

				if(this.play) {
					clearInterval(this.timer)
					this.$refs.audio.pause()
					this.play = false
				} else {
					this.timer = setInterval(this.getTime, 1000)
					this.$refs.audio.play()
					this.play = true
				}

			},

			getTime() {
				var time = this.$refs.audio.currentTime
				var allTime = parseInt(this.$store.state.songItem.time)
				this.allTime = allTime
				this.value = parseFloat((time / allTime) * 100)

				if(this.value >= 100) {
					for(var i = 0; i < this.$store.state.songs.length; i++) {
						if(this.songItem.id == this.$store.state.songs[i].id) {
							var index = ++i
							if((index + 1) >= this.$store.state.songs.length) {
								this.songItem = this.$store.state.songs[0]
							} else {
								this.songItem = this.$store.state.songs[index]
							}
						}
					}
				}

			},

			changeValue(value) {
				this.$refs.audio.currentTime = (value / 100) * this.allTime
			},

			onSearch(searchValue) {

				for(var i = 0; i < this.loveSongs.length; i++) {

					if(this.searchValue === this.loveSongs[i].name) {

						this.loveSongs = [this.loveSongs[i]]
					}
				}

			},

			//点击弹出视频
			PopupVideo(item) {
				this.videoShow = true
				this.url = item.url
				//				console.log('this.$refs.video ==>', this.$refs.video)

			},

			pause() {
				this.$refs.video.pause()
			},

			videoPlay() {
				this.playing = !this.playing
				if(this.playing) {
					this.$refs.video.play()
				} else {
					this.$refs.video.pause()
				}

			},
		},

		created() {
			//当前登录的Id
			var userLogin = JSON.parse(localStorage.getItem('userLogin'))
			var userId = userLogin.userId
			//			//当前收藏的歌曲
			//			var loveSongs = localStorage.getItem('this.loveSongs')
			//			loveSongs = loveSongs == undefined ? {} : JSON.parse(loveSongs)

			var arrayVideo = JSON.parse(localStorage.getItem('arrayVideo'))
			var arraySongs = JSON.parse(localStorage.getItem('arraySongs'))

			for(var i = 0; i < arrayVideo.length; i++) {
				if(arrayVideo[i].userId == userId) {
					this.loveVideo = arrayVideo[i].arr
					if(this.loveVideo.length == 0) {
						this.collectVideo1 = true
					} else {
						this.collectVideo2 = true
					}
				}
			}

			for(var i = 0; i < arraySongs.length; i++) {
				if(arraySongs[i].userId == userId) {
					this.loveSongs = arraySongs[i].arr
					if(this.loveSongs.length == 0) {
						this.collectActive1 = true
					} else {
						this.collectActive2 = true
						this.$store.commit('getSongs', this.loveSongs)
					}
				}
			}

		},

		mounted() {
			new WOW.WOW().init()
		},

		components: {
			[List.name]: List,
			[NavBar.name]: NavBar,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
			[Row.name]: Row,
			[Col.name]: Col,
			[Slider.name]: Slider,
			[Search.name]: Search,
			[Popup.name]: Popup,
			[Toast.name]: Toast

		},

	}
</script>

<style lang="less" scoped="scoped">
	.collectMusic {
		font-size: 16px;
		.text {
			margin: 4rem auto;
			font-style: 16px;
			color: #404040;
			text-align: center;
		}
		.songlist {
			background-color: #F7F7F7;
			padding: .1rem .15rem;
			/*	padding-bottom: 3.8rem;*/
			.listBox {
				border-bottom: 1px solid #E9E9E9;
				.index {
					text-align: center;
					vertical-align: middle;
					margin-top: .3rem;
					font-size: 18px;
					color: #CCCCCC;
				}
				.songAuthor {
					font-size: 12px;
					margin-bottom: .12rem;
				}
				.icon {
					text-align: right;
					i {
						display: inline-block;
						margin-top: .2rem;
						font-size: .5rem;
					}
				}
				.songName {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-size: 17px;
					margin: .12rem 0;
				}
			}
		}
		.playerBox {
			width: 100%;
			height: 1rem;
			background-color: #003F96;
			position: fixed;
			bottom: 0;
			left: 0;
			box-sizing: border-box;
			padding: .1rem;
			.image {
				text-align: center;
				.imageBox {
					border-radius: 50%;
					height: .8rem;
					width: .8rem;
					overflow: hidden;
					animation: am1 10s linear 0s infinite;
				}
			}
			.progress {
				margin-top: .1rem;
				.custom-button {
					width: 10px;
					height: 10px;
					border-radius: 50%;
					background-color: yellow;
					animation: light 2s linear 0s infinite alternate;
				}
			}
			.controlStop {
				margin-top: .12rem;
				text-align: right;
				span:nth-of-type(1) {
					margin-top: .1rem;
					font-size: 16px;
				}
				span {
					font-size: 24px;
					display: inline-block;
					color: #FFFFEF;
				}
				span:nth-of-type(2) {
					margin-right: .3rem;
					font-size: 30px;
				}
				span:nth-of-type(3) {
					font-size: 27px;
				}
			}
			.singer {
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
				width: 150px;
				text-align: left;
			}
		}
		@keyframes am1 {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}
		@keyframes light {
			from {
				box-shadow: 0 0 8px 1px rgba(255, 255, 255, .3);
			}
			to {
				box-shadow: 0 0 8px 4px rgba(255, 255, 255, 1);
			}
		}
		.box {
			padding: .1rem;
			/*	text-align: center;*/
			.name {
				padding: 0;
				margin: 0;
				font-size: 14px;
				padding: .1rem;
				text-align: left;
				height: 30px;
				overflow: hidden;
				/*white-space: nowrap;*/
				text-overflow: ellipsis;
			}
			.video {
				position: relative;
				padding-bottom: 100%;
				img {
					position: absolute;
					width: 100%;
					left: 0;
					top: 0;
					height: 176px;
					z-index: 1;
					border-radius: .1rem;
				}
				.listerncount {
					position: absolute;
					left: 0;
					top: 0;
					z-index: 2;
					color: #FFFFFF;
					font-size: 12px;
					padding: .05rem;
				}
				.singer {
					position: absolute;
					left: .05rem;
					bottom: 0rem;
					z-index: 2;
					color: #FFFFFF;
					font-size: 12px;
					padding: .05rem;
				}
				.like {
					position: absolute;
					right: .05rem;
					top: 0rem;
					z-index: 2;
					color: #FFFFFF;
					font-size: 12px;
					padding: .05rem;
				}
			}
		}
		video {
			width: 6rem;
		}
		.icon-aixin1 {
			color: red;
		}
		/*结束*/
	}
</style>