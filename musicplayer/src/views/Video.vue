<template>
	<div class="video animated fadeIn">
		<p class="title"><i class="iconfont icon-mv-line"></i>热门MV排行榜</p>

		<van-row class="videoBox">
			<van-col span="12" class="box" v-for="(item,index) in videoInfo" :key="index">
				<div class="video" @click="PopupVideo(item)">
					<img class="auto-img" :src="item.pic" alt="" />
					<span class="listerncount"><i class="iconfont icon-erji"></i> {{item.playCount}}</span>
					<span class="singer"><i class="iconfont icon-geshou"></i> {{item.singer}}</span>
					<span class="like"><i class="iconfont icon-aixin" ref="isActive"  @click="clickLike(item,index)"></i> {{item.playCount}}</span>
				</div>
				<p class="name">{{item.name}}</p>
			</van-col>
		</van-row>

		<van-popup v-model="show" @click-overlay="pause">

			<video ref="video" :src="url" class="auto-img" @click="play" controls="controls"></video>

		</van-popup>

	</div>
</template>

<script>
	import animate from '../../node_modules/animate.css'
	import { Row, Col, Popup, Toast } from 'vant';

	export default {
		name: 'Video',

		data() {
			return {
				videoInfo: [],
				//弹出视频层
				show: false,
				//视频地址
				url: '',
				//是否播放
				playing: false,
				//是否加入我的收藏
				isActive: false,
				//收藏的video
//				loveVideo: {},
				collectNum:0,

			}
		},

		methods: {
			//点击弹出视频
			PopupVideo(item) {
				this.show = true
				this.url = item.url
				console.log('this.$refs.video ==>', this.$refs.video)

			},

			pause() {
				this.$refs.video.pause()
			},

			play() {
				this.playing = !this.playing
				if(this.playing) {
					this.$refs.video.play()
				} else {
					this.$refs.video.pause()
				}

			},

			//点赞
			clickLike(item, index) {
				this.isActive = !this.isActive

				var userLogin = JSON.parse(localStorage.getItem('userLogin'))
				var userId = userLogin.userId

				var loveVideo = localStorage.getItem('loveVideo')
				loveVideo = loveVideo == undefined ? {} : JSON.parse(loveVideo)

				var arrayVideo = localStorage.getItem('arrayVideo')
				arrayVideo = arrayVideo == undefined ? [] : JSON.parse(arrayVideo)
				
				
				

				if(this.isActive) {
					this.$refs.isActive[index].className = 'iconfont icon-aixin1'
						++item.playCount
						++collectNum
					//判断是否登陆了，同时是不是点心了
					if(userId && this.$refs.isActive[index].className == 'iconfont icon-aixin1') {

						var arr = []
						arr.unshift(item)

						//如果loveVideo里面没有任何值
						if(isOwnEmpty(loveVideo)) {
							//判断是不是空对象　　　是空对象
							loveVideo = {
								userId: userId,
								arr: arr
							}
							localStorage.setItem('loveVideo', JSON.stringify(loveVideo))
							arrayVideo.push(loveVideo)
							localStorage.setItem('arrayVideo', JSON.stringify(arrayVideo))
						}
						//对象里面有值
						else {

							if(loveVideo.userId != userId) {
								//先去查看这里面是否有当前的userId的用户存在
								for(var i = 0; i < arrayVideo.length; i++) {
									if(userId == arrayVideo[i].userId) {
										loveVideo={
											userId :userId,
											arr:arrayVideo[i].arr
										}
										
										for(var i = 0; i < loveVideo.arr.length; i++) {

											if(item.id == loveVideo.arr[i].id) {

												Toast('你已经收藏过这MV了');
												return
											}
										}

										loveVideo.arr.unshift(item)
										arrayVideo[i].arr = loveVideo.arr
										localStorage.setItem('loveVideo', JSON.stringify(loveVideo))
									} else {
											console.log('ncdiuan')
										loveVideo = {
											userId: userId,
											arr: arr
										}
										localStorage.setItem('loveVideo', JSON.stringify(loveVideo))
										arrayVideo.push(loveVideo)
										localStorage.setItem('arrayVideo', JSON.stringify(arrayVideo))
									}

								}

								localStorage.setItem('arrayVideo', JSON.stringify(arrayVideo))
							} else {

								for(var i = 0; i < loveVideo.arr.length; i++) {

									if(item.id == loveVideo.arr[i].id) {

										Toast('你已经收藏过这MV了');
										return
									}
								}

								loveVideo.arr.unshift(item)

								localStorage.setItem('loveVideo', JSON.stringify(loveVideo))
								for(var i = 0; i < arrayVideo.length; i++) {
									if(arrayVideo[i].userId == userId) {
										arrayVideo[i].arr = loveVideo.arr
									}
								}
								localStorage.setItem('arrayVideo', JSON.stringify(arrayVideo))
							}
						}
					}
					//没有登录会调到登录页面
					else {
						this.$router.push({ name: 'login' })
					}
				}
				//取消点心
				if(this.isActive == false && this.$refs.isActive[index].className == 'iconfont icon-aixin1') {
					--item.playCount
					--collectNum
					this.$refs.isActive[index].className = 'iconfont icon-aixin'
					if(loveVideo.userId == userId) {
						loveVideo.arr.shift(1)
						localStorage.setItem('loveVideo', JSON.stringify(loveVideo))
						for(var i = 0; i < arrayVideo.length; i++) {
							if(arrayVideo[i].userId == userId) {
								arrayVideo[i].arr = loveVideo.arr
							}
						}
						localStorage.setItem('arrayVideo', JSON.stringify(arrayVideo))
					}
				}

			}

		},

		created() {
			this.axios({
				method: 'get',
				url: 'https://api.itooi.cn/music/netease/topMvList?key=579621905&limit=10&offset=0'
			}).then(data => {

				var videoInfo = data.data.data
				this.$store.commit('getVideoInfo', videoInfo)

				this.videoInfo = videoInfo

				console.log('this.videoInfo =>', this.videoInfo)
			})
		},

		components: {
			[Row.name]: Row,
			[Col.name]: Col,
			[Popup.name]: Popup,
			[Toast.name]: Toast
		}
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
	.video {
		font-size: 18px;
		.title {
			/*position: sticky;*/
			background-color: #003F96;
			color: #FFFFFF;
			font-size: 18px;
			margin: 0;
			padding: .1rem 0;
			color: #FFFFFF;
			i {
				color: #FFFFEF;
				font-size: 18px;
				margin: 0 .1rem;
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
	}
</style>