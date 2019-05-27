<template>
	<div class="player animated fadeIn">
		<div class="background">
			<div class="mask"></div>
			<div class="image-wrapper"><img :src="songItem.pic" class="image"></div>
		</div>

		<van-nav-bar :title="title" class="header" @click-left="onClickLeft" @click-right="shareSongs">
			<span class="iconfont icon-iconfontzhizuobiaozhun20 right" slot="right"></span>
			<van-icon name="arrow-left" slot="left" class="left" />
		</van-nav-bar>

		<!--光碟旋转-->
		<div class="jukebox" v-if="songwordShow1">
			<div class="record-wrapper">
				<img :class="{'microphonePlay': microphonePlay}" class="microphone" src="../assets/player.png">
				<div class="record-content" :class="{'active':microphonePlay}">
					<div class="record" :class="{'active':microphonePlay}"></div>
					<img class="cover" :src="songItem.pic">
				</div>
			</div>
		</div>
		<!--歌词-->
		<div class="container" v-if="songwordShow2" @click="getSongWord">
			<div class="bg">
				<div>{{songItem.name}} </div><small>{{songItem.singer}}</small>
			</div>
			<div class="line" v-for="(item, index) in lines" v-show="currentLine == index" :class="currentLine == index ? currentClass : ''" :style="randomStyle">{{item.text}}</div>
		</div>

		<div class="play-wrapper">
			<div class="icon-wrapper">
				<i class="iconfont icon-aixin" :class="{'active01':isActive}" @click="Collect"></i>
				<i class="iconfont icon-xiazai" @click="downloadSongs"></i>
				<i class="iconfont icon-iconset0122" @click="getSongWord"></i>
				<i class="iconfont icon-dashujukeshihuaico-"></i>
			</div>
			<div class="progress">
				<van-row>
					<van-col span="4" class="time"><span>{{currentTime}}</span></van-col>
					<van-col span="16">
						<van-slider v-model="value" class="progressBox" @change="changeValue(value)" active-color="#FFFF00">
							<div ref="button" slot="button" class="custom-button">
							</div>
						</van-slider>

					</van-col>
					<van-col span="4" class="time"><span>{{totalTime}}</span></van-col>
				</van-row>
			</div>

			<van-row class="control">
				<van-col span="4"><i class="iconfont icon-fanhui" @click="callBack"></i></van-col>
				<van-col span="16">
					<van-row>
						<van-col span="8"> <i @click="playPre" class="iconfont icon-48shangyishou"></i></van-col>
						<van-col span="8"><i @click="play" class="iconfont  play" :class="[microphonePlay? 'icon-suspend_icon' : 'icon-bofang']"></i></van-col>
						<van-col span="8"> <i @click="playNext" class="iconfont icon-49xiayishou"></i></van-col>
					</van-row>
				</van-col>
				<van-col span="4"> <i class="iconfont icon-caidan"></i></van-col>
			</van-row>

		</div>

		<audio ref="audio" :src="songItem.url" autoplay="autoplay"></audio>
	</div>
</template>

<script src="https://cdn.bootcss.com/vue/2.2.1/vue.js"></script>

<script>
	import animate from '../../node_modules/animate.css'
	import { NavBar, Icon, Row, Col, Slider, Toast, Dialog } from 'vant'

	export default {
		name: 'player',

		data() {
			return {
				songItem: [],

				title: '',
				//是否播放
				microphonePlay: true,

				audioShow: false,
				//当前播放时间
				currentTime: '00:00',

				//滑块的值
				value: 0,
				//定时器
				timer: null,
				//当前歌单的所有歌曲
				songs: [],

				//点心
				isActive: false,

				//喜欢的歌曲
				loveSongs: {},

				//歌词
				lrc: '',
				lines: [],
				animates: 'fadeIn'.split(' '),
				randomAnimate: '',
				currentLine: 0,
				randomStyle: {},
				time: '00:00.00',

				//显示歌词还是显示旋转盘
				songwordShow1: true,
				songwordShow2: false,
				wordShowActive: false,

				wordtimer: '',

				diffTime: ''

			}
		},

		watch: {
			time: function(val) {
				var that = this;
				var num = parseFloat(val.replace(':', '.')) * 1000

				that.lines.forEach(function(item, index) {
					if(item.time.indexOf(val.substr(0, 7)) === 0) {
						that.randomStyle = {
							color: `rgba(60, ${200 + randomInt(50)}, ${200 + randomInt(50)}, 0.9)`,
							//							left: randomInt(document.body.clientWidth) + 'px',
							//							top: randomInt(50) + 'px'
						}
						that.randomAnimate = that.animates[parseInt(Math.random() * that.animates.length)]
						that.currentLine = index

						return false
					}
				})
			}
		},

		methods: {
			//重播
			callBack() {
				this.$refs.audio.currentTime = 0
				this.$refs.audio.play()
			},
			getSongWord() {
				this.wordShowActive = !this.wordShowActive
				if(this.wordShowActive) {
					this.songwordShow1 = true
					this.songwordShow2 = false
				} else {
					this.songwordShow1 = false
					this.songwordShow2 = true
				}
			},

			fetch() {
				this.lines = [];
				var lines = this.lrc.split("\n");

				for(var k in lines) {
					var timeMatch = lines[k].match(/\[(\d+:\d+\.\d+)\]/)
					this.lines.push({
						time: timeMatch ? timeMatch.pop() : '',
						text: lines[k].replace(/^.+?\]/, ''),

					})

				}
			},
			run() {
				var that = this
				this.fetch()

				var startTime = new Date()
				this.wordtimer = setInterval(function() {
					var currentTime = new Date()

					var diff = new Date((currentTime - startTime) * 1.09)
					this.diffTime = diff
					var ms = parseInt(diff.getMilliseconds() / 10);
					that.time = `${diff.getMinutes().pad()}:${diff.getSeconds().pad()}.${ms.pad()}`

				}, 100)
			},

			onClickLeft() {
				clearInterval(this.timer)

				if(this.$route.params.active) {
					this.$router.go(-1)
				} else {
					this.$router.push({ name: 'musiclist', params: { mid: this.$store.state.mid, creator: this.$store.state.creator, tag: this.$store.state.tag } })

				}

			},

			//加0操作
			addZero(value) {
				if(!value) {
					return '00';
				}
				return value > 9 ? value : '0' + value;
			},

			getTime() {

				var time = this.$refs.audio.currentTime
				var allTime = parseInt(this.$store.state.songItem.time)
				this.allTime = allTime
				this.value = parseFloat((time / allTime) * 100)

				var mm = this.addZero(Math.floor(time / 60))
				var ss = this.addZero(parseInt(time % 60))
				this.currentTime = mm + " : " + ss

				if(this.value >= 100) {
					this.$refs.audio.pause
					this.microphonePlay = false
				}
			},

			changeValue(value) {
				this.$refs.audio.currentTime = (value / 100) * this.allTime
			},
			//上一首
			playPre() {
				this.isActive = false
				for(var i = 0; i < this.songs.length; i++) {
					if(this.songItem.id == this.songs[i].id) {
						var index = --i
						var lastIndex = parseInt(this.songs.length - 1)
						if(index <= 0) {
							//判断要是已经是第一首个就跳转到最后一首歌

							Toast('即将跳转最后一首歌');
							this.songItem = this.songs[lastIndex]
							this.$store.commit('getSongItem', this.songItem)
							this.title = this.songItem.name
						} else {

							this.songItem = this.songs[index]
							this.$store.commit('getSongItem', this.songItem)
							this.title = this.songItem.name
						}
					}
				}

				this.axios({
					method: 'get',
					url: this.songItem.lrc
				}).then(data => {
					this.lrc = data.data
					//				console.log('this.lrc =》', this.lrc)
					this.run()
				})

			},
			//下一首
			playNext() {
				this.isActive = false
				for(var i = 0; i < this.songs.length; i++) {
					if(this.songItem.id == this.songs[i].id) {
						var index = ++i
						var lastIndex = parseInt(this.songs.length - 1)
						if(index >= lastIndex) {
							Toast('即将跳转到第一首歌');
							this.songItem = this.songs[0]
							this.$store.commit('getSongItem', this.songItem)
							this.title = this.songItem.name
						} else {
							this.songItem = this.songs[index]
							this.$store.commit('getSongItem', this.songItem)
							this.title = this.songItem.name
						}
					}
				}

				this.axios({
					method: 'get',
					url: this.songItem.lrc
				}).then(data => {
					this.lrc = data.data
					//				console.log('this.lrc =》', this.lrc)
					this.run()
				})

			},
			//暂停或者播放
			play() {
				if(this.microphonePlay) {

					this.$refs.audio.pause()
					this.microphonePlay = false
					clearInterval(this.timer)
					clearInterval(this.wordtimer)
				} else {
					this.timer = setInterval(this.getTime, 1000)

					var that = this
					this.fetch()

					var startTime = new Date() - this.diffTime
					this.wordtimer = setInterval(function() {
						var currentTime = new Date()

						var diff = new Date((currentTime - startTime) * 1.09)

						var ms = parseInt(diff.getMilliseconds() / 10);
						that.time = `${diff.getMinutes().pad()}:${diff.getSeconds().pad()}.${ms.pad()}`

					}, 100)

					this.$refs.audio.play()
					this.microphonePlay = true
				}
			},

			//点心收藏
			Collect() {
				this.isActive = !this.isActive
				//				console.log('this.isActive =>', this.isActive)

				var userLogin = JSON.parse(localStorage.getItem('userLogin'))
				var userId = userLogin.userId

				var loveSongs = localStorage.getItem('loveSongs')
				loveSongs = loveSongs == undefined ? {} : JSON.parse(loveSongs)

				var arraySongs = localStorage.getItem('arraySongs')
				arraySongs = arraySongs == undefined ? [] : JSON.parse(arraySongs)

				var currentSongs = this.$store.state.songItem

				var collectNum = localStorage.getItem('collectNum')
				collectNum = collectNum == undefined ? 0 : collectNum

				if(this.isActive) {
					//判断是否登录
					if(userId) {
						var arr = []
						arr.unshift(currentSongs)

						//如果loveSongs里面没有任何值
						if(isOwnEmpty(loveSongs)) {
							//判断是不是空对象　　　是空对象
							loveSongs = {
								userId: userId,
								arr: arr
							}
							localStorage.setItem('loveSongs', JSON.stringify(loveSongs))
							arraySongs.push(loveSongs)
							localStorage.setItem('arraySongs', JSON.stringify(arraySongs))
						}
						//对象里面有值
						else {
							if(loveSongs.userId != userId) {
								//先去查看这里面是否有当前的userId的用户存在
								for(var i = 0; i < arraySongs.length; i++) {
									if(userId == arraySongs[i].userId) {
										loveSongs = {
											userId: userId,
											arr: arraySongs[i].arr
										}

										for(var i = 0; i < loveSongs.arr.length; i++) {

											if(currentSongs.id == loveSongs.arr[i].id) {

												Toast('你已经收藏过这MV了');
												return
											}
										}

										loveSongs.arr.unshift(item)
										arraySongs[i].arr = loveSongs.arr
										localStorage.setItem('loveSongs', JSON.stringify(loveSongs))
									} else {

										loveSongs = {
											userId: userId,
											arr: arr
										}
										localStorage.setItem('loveSongs', JSON.stringify(loveSongs))
										arraySongs.push(loveSongs)
										localStorage.setItem('arraySongs', JSON.stringify(arraySongs))
									}

								}

								localStorage.setItem('arraySongs', JSON.stringify(arraySongs))
							} else {

								for(var i = 0; i < loveSongs.arr.length; i++) {

									if(currentSongs.id == loveSongs.arr[i].id) {

										Toast('你已经收藏过这MV了');
										return
									}
								}

								loveSongs.arr.unshift(currentSongs)

								localStorage.setItem('loveSongs', JSON.stringify(loveSongs))
								for(var i = 0; i < arraySongs.length; i++) {
									if(arraySongs[i].userId == userId) {
										arraySongs[i].arr = loveSongs.arr
									}
								}
								localStorage.setItem('arraySongs', JSON.stringify(arraySongs))
							}
						}
					}

					//没有登录会调到登录页面
					else {
						this.$router.push({ name: 'login' })
					}
				}

				//取消点心
				if(this.isActive == false) {

					if(loveSongs.userId == userId) {
						loveSongs.arr.shift(1)
						localStorage.setItem('loveSongs', JSON.stringify(loveSongs))
						for(var i = 0; i < arraySongs.length; i++) {
							if(arraySongs[i].userId == userId) {
								arraySongs[i].arr = loveSongs.arr
							}
						}
						localStorage.setItem('arraySongs', JSON.stringify(arraySongs))
					}
				}

			},

			//分享歌曲
			shareSongs() {

				//分享的歌曲
				var shareSongs = localStorage.getItem('shareSongs')
				shareSongs = shareSongs == undefined ? [] : JSON.parse(shareSongs)
				//当前的用户名
				var userLogin = JSON.parse(localStorage.getItem('userLogin'))
				var username = userLogin.username
				var userId = userLogin.userId

				if(userId) {
					var shareSongsBox = {
						userId: userId,
						username: username,
						songItem: this.songItem
					}

					shareSongs.unshift(shareSongsBox)
					localStorage.setItem('shareSongs', JSON.stringify(shareSongs))
					Toast('分享成功')
				} else {

					Dialog.confirm({
						title: '登录提示',
						message: '您还未登录，请先去登录'
					}).then(() => {
						this.$router.push({ name: 'login' })
					}).catch(() => {
						return
					});

					
				}

			},

			//下载歌曲
			downloadSongs() {
				console.log('ok')

//				//分享的歌曲
//				var downloadSongs = localStorage.getItem('downloadSongs')
//				downloadSongs = downloadSongs == undefined ? [] : JSON.parse(downloadSongs)
//				//当前的用户名
//				var userLogin = JSON.parse(localStorage.getItem('userLogin'))
//				var userId = userLogin.userId
//
//				var downloadSongsBox = {
//					userId: userId,
//					songsItem: this.songItem
//				}
//				for(var i = 0; i < downloadSongs.length; i++) {
//
//					if(downloadSongs.length == 0) {
//
//					}
//
//					if(downloadSongsBox.userId == downloadSongs[i].userId)
//						downloadSongs[i].arr.unshift(downloadSongsBox.songsItem)
//				}
//
//				Toast('正在下载')
//				setTimeout(() => {
//					Toast('下载成功')
//				}, 5000)
			}

		},

		created() {

			this.songItem = this.$route.params.songItem
			this.$store.commit('getSongItem', this.songItem)

			this.title = this.songItem.name

			//			console.log('this.$store.state.songs==>', this.$store.state.songs)
			this.songs = this.$store.state.songs

			this.axios({
				method: 'get',
				url: this.songItem.lrc
			}).then(data => {
				this.lrc = data.data
				//				console.log('this.lrc =》', this.lrc)
				this.run()
			})

		},
		mounted() {
			this.$refs.audio.currentTime = this.$route.params.time
			this.timer = setInterval(this.getTime, 1000)

		},
		computed: {
			totalTime() {
				var mm = this.addZero(Math.floor(this.songItem.time / 60))
				var ss = this.addZero(this.songItem.time % 60)
				return mm + " : " + ss
			},

			currentClass: function() {
				return 'active animated ' + this.randomAnimate
			}
		},

		components: {
			[NavBar.name]: NavBar,
			[Icon.name]: Icon,
			[Row.name]: Row,
			[Col.name]: Col,
			[Slider.name]: Slider,
			[Toast.name]: Toast,
			[Dialog.name]: Dialog

		}
	}
	Number.prototype.pad = function() {
		var n = this
		return(n < 10) ? ("0" + n) : n;
	}

	function randomInt(n) {
		return parseInt(Math.random() * n)
	}

	//判断是否为空对象
	function isOwnEmpty(obj) {　　
		for(var name in obj)　　 {　　　　
			if(obj.hasOwnProperty(name)) {　　　　　　
				return false; //返回false，不为空对象
				　　　　
			}　　
		}　　
		return true; //返回true，为空对象
	};
</script>

<style lang="less" scoped="scoped">
	.player {
		width: 100%;
		height: 100%;
		.background {
			overflow: hidden;
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			.mask {
				position: absolute;
				width: 100%;
				height: 100%;
				background: rgba(20, 20, 20, 0.6);
				z-index: -1;
			}
			.image-wrapper {
				position: relative;
				width: 100%;
				max-width: 700px;
				height: 100%;
				z-index: -10;
				.image {
					height: 100%;
					width: 100%;
					max-width: 700px;
					filter: blur(30px);
				}
			}
		}
		.header {
			font-size: 20px;
			background-color: transparent;
			color: #FFFFFF;
			.right {
				font-size: 20px;
				color: #FFFDEF;
			}
			.left {
				font-size: 25px;
				color: #FFFDEF;
			}
			.van-nav-bar__title {
				margin: 0 auto;
				max-width: 60%;
				color: #f2f3f5;
				font-size: 20px;
				font-weight: 500;
			}
		}
		.container {
			line-height: 1.8em;
			color: #666;
			text-align: center;
			position: relative;
		}
		.container .line {
			text-align: center;
			left: 50%;
			margin-left: -2.5rem;
			word-break: break-all;
			transition: all 0.3s;
			width: 5rem;
			position: absolute;
			top: 250px;
		}
		.active {
			font-size: 16px;
			line-height: 1.8em;
			/*color: #6c6;*/
		}
		.bg {
			font-size: 16px;
			text-align: center;
			margin-top: .3rem;
			line-height: 1.5em;
			text-align: center;
			color: #FFFFEF;
		}
		.jukebox {
			background-color: transparent;
			position: relative;
			text-align: center;
			.microphone {
				position: absolute;
				top: -2px;
				left: 44.4%;
				height: 140px;
				z-index: 10;
				transform: rotate(-26deg);
				transform-origin: 17.39% 11.59%;
				transition: all .5s;
			}
			.microphonePlay {
				position: absolute;
				top: -2px;
				left: 44.4%;
				height: 140px;
				transform: rotate(0deg);
				transform-origin: 17.39% 11.59%;
				transition: all .5s;
				z-index: 10;
			}
			.active {
				animation: am1 10s linear 0s infinite;
			}
			.record-content {
				position: relative;
				display: inline-block;
				width: 5rem;
				height: 5rem;
				margin-top: 80px;
				text-align: center;
				vertical-align: center;
				padding: 10px;
				border-radius: 50%;
				background: rgba(220, 220, 220, .2);
				/*animation: am1 10s linear 0s infinite;*/
				.record {
					position: absolute;
					width: 100%;
					height: 100%;
					max-width: 400px;
					max-height: 400px;
					top: 0;
					right: 0;
					z-index: 5;
					background: url('../assets/record.png') no-repeat;
					background-size: contain;
				}
				.cover {
					width: 100%;
					max-width: 380px;
					max-height: 380px;
					border-radius: 50%;
					z-index: -1;
				}
			}
		}
		.play-wrapper {
			position: absolute;
			bottom: 0;
			width: 100%;
			text-align: center;
			.icon-wrapper {
				display: inline-flex;
				width: 80%;
				height: 30px;
				line-height: 30px;
				color: #fff;
				text-align: center;
				.active01 {
					color: red;
				}
				i {
					flex: 1;
					font-size: 30px;
				}
			}
		}
		.progress {
			background-color: transparent;
			font-size: 16px;
			padding: .1rem 0;
			.time {
				background-color: transparent;
				span {
					color: #FFFfFF;
				}
			}
			.progressBox {
				margin-top: .15rem;
				padding: 0 .05rem;
				.custom-button {
					width: 10px;
					height: 10px;
					border-radius: 50%;
					background-color: white;
					animation: light 2s linear 0s infinite alternate;
				}
			}
		}
		.control {
			font-size: 20px;
			color: #ffffff;
			margin: .3rem 0;
			line-height: .3rem;
			.play {
				font-size: 35px;
				margin-top: -5px;
			}
			i {
				font-size: 20px;
			}
		}
		/*结束啦*/
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
	}
</style>