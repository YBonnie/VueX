<template>
	<div class="musicList animated fadeIn">
		<van-row class="imgContent">
			<van-col span="10">
				<div class="imgBox">
					<img :src="songList.songListPic" class="auto-img" />
				</div>
			</van-col>
			<van-col span="14">
				<div class="imgDesc">
					<van-row>
						<van-col span="24" class="desc">{{songList.songListName}}</van-col>
						<van-col span="24" class="creator">{{creator}}</van-col>
					</van-row>
				</div>

			</van-col>
		</van-row>
		<div class="tag"><span>标签：</span><span>{{tag}}</span></div>

		<van-collapse v-model="activeName" accordion>
			<van-collapse-item title="简介" name="1">
				{{songList.songListDescription}}
			</van-collapse-item>
		</van-collapse>

		<p class="tip">歌曲列表 (共{{songList.songListCount}}首)</p>

		<div class="songlist">
			<van-row class="listBox" v-for="(item,index) in songs" :key="index" :ref="'van' + index" @click.native="goPath(item)">
				<van-col span="4" class="index">{{index+1}}</van-col>
				<van-col span="16">
					<van-row>
						<van-col span="24" class="songName">{{item.name}}</van-col>
						<van-col span="24" class="songAuthor">{{item.singer}}</van-col>
					</van-row>
				</van-col>
				<van-col span="4" class="icon"><i class="iconfont icon-bofang"></i></van-col>
			</van-row>
		</div>

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
		import WOW from '../../node_modules/wowjs/dist/wow.js'
	import animate from '../../node_modules/animate.css'
	import { Row, Col, Collapse, CollapseItem, Slider } from 'vant';

	export default {
		name: 'musiclist',

		data() {
			return {
				id: 0,

				songList: [],

				songListUserId: 0,

				creator: '',

				tag: '',

				activeName: '1',

				songs: [],

				allSongs: [],

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

				//当前歌曲
				currentSong: [],

				//startIndex
				startIndex: 0,
				//endIndex
				endIndex: 10,

			}
		},

		methods: {
			getSongs() {
				//当前歌单的所有歌曲
				var allSongs = this.$store.state.songs
				this.allSongs = allSongs
				this.songs = this.allSongs.slice(this.startIndex, this.endIndex)
				this.startIndex = this.endIndex;
				this.endIndex += 10;
			},

			goStatus() {
				clearInterval(this.timer)
				this.$router.push({ name: 'player', params: { songItem: this.songItem, time: this.$refs.audio.currentTime } })
			},
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
			}

		},

		created() {
			this.id = this.$route.params.mid
			this.$store.commit('getMid', this.id)

			this.creator = this.$route.params.creator
			this.$store.commit('getCreator', this.creator)

			this.tag = this.$route.params.tag
			this.$store.commit('getTag', this.tag)

			this.axios({
				method: 'get',
				url: 'https://api.itooi.cn/music/netease/songList?key=579621905&id=' + this.id
			}).then(data => {
				//当前歌单
				this.songList = data.data.data
				//当前歌单的所有歌曲
				var songs = data.data.data.songs

				this.$store.commit('getSongs', songs)

				this.songs = songs

				this.getSongs()

			})
		},

		mounted() {

			new WOW.WOW().init()
			//数据懒加载
			var timer_02 = [];

			window.onscroll = () => {
				if(this.songs.length >= this.allSongs.length) {
					return
				}

				//获取页面距离
				var scrollTop = document.documentElement.scrollTop;

				//获取最后一个节点
				var lastRef = this.$refs['van' + (this.songs.length - 1)][0].$el

				//获取最后一个节点的offsetTop
				var offsetTop = lastRef.offsetTop

				//获取最后一个节点的offsetHeight
				var offsetHeight = lastRef.offsetHeight

				var h = offsetTop - offsetHeight - 600

				if(scrollTop >= h) {
					var timer_01 = setInterval(() => {
						this.songs.push(...this.allSongs.slice(this.startIndex, this.endIndex))

						this.startIndex = this.endIndex;
						this.endIndex += 10;
						clearTimeout(timer_01);
						timer_01 = null;
						timer_02 = [];
					}, 500)

					timer_02.push(timer_01);

					for(var i = 1; i < timer_02.length; i++) {
						clearTimeout(timer_02[i]);
					}
				}

			}

		},

		components: {
			[Row.name]: Row,
			[Col.name]: Col,
			[Collapse.name]: Collapse,
			[CollapseItem.name]: CollapseItem,

			[Slider.name]: Slider

		},

		//离开当前组件守卫
		beforeRouteLeave(to, from, next) {
			window.onscroll = null;
			next();
		}
	}
</script>

<style lang="less" scoped="scoped">
	.musicList {
		font-size: 16px;
		.imgContent {
			background-color: #6B4A54;
			.imgBox {
				box-sizing: border-box;
				padding: .2rem;
			}
			.imgDesc {
				box-sizing: border-box;
				padding: .2rem 0;
				.desc {
					color: #FFFfEF;
					margin-top: .6rem;
				}
				.creator {
					margin-top: .2rem;
					color: #FFFfEF;
				}
			}
		}
		.tag {
			padding: .1rem .15rem;
			span:nth-of-type(2) {
				display: inline-block;
				margin-right: 10px;
				padding: 1px 8px;
				font-size: 12px;
				border: 1px solid #E9E9E9;
				border-radius: .5rem;
			}
		}
		.tip {
			background-color: #E9E9E9;
			padding: 0;
			margin: 0;
			font-size: 12px;
			padding: .1rem .15rem;
		}
		.songlist {
			background-color: #F7F7F7;
			padding: .1rem .15rem;
			padding-bottom: .9rem;
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
</style>