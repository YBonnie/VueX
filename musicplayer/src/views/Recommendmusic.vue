<template>
	<div class="recommendmusic animated fadeIn">
		<div class="hotmusic">
			<p class="title">推荐歌单</p>
			<van-row>
				<van-col span="8" v-for="(item,index) in playlists" :key="index" @click.native="goPath(index)">
					<div class="listBox">
						<div class="imgBox">
							<img class="auto-img" :src="item.coverImgUrl" />
							<span><i class="iconfont icon-erji"></i>170万</span>
						</div>
						<p class="desc">{{item.title}}</p>
					</div>
				</van-col>
			</van-row>
		</div>

		<div class="newMusic">
			<p class="title">最新音乐</p>
			<van-row class="newSongList" v-for="(item,index) in newSongs" :key="index" @click.native="getSong(item)">
				<van-col span="20">
					<van-row>
						<van-col span="24" class="songName">{{item.name}}</van-col>
						<van-col span="24" class="songAuthor">
							<van-row>
								<van-col span="2">
									<span class="iconfont icon-hot"></span>
								</van-col>
								<van-col span="22">
									<span>{{item.singer}}</span>
								</van-col>
							</van-row>
						</van-col>
					</van-row>
				</van-col>
				<van-col span="4" class="icon"><i class="iconfont icon-bofang"></i></van-col>
			</van-row>
		</div>
		
		
		<!--播放器-->
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
	import { Row, Col,Slider} from 'vant';

	export default {
		name: 'recommendmusic',

		data() {
			return {
				//获取数据
				playlists: [],

				id: 0,

				newSongs: [],
				//歌单下标
				index: 0,
				//定时器
				timer: null,
				
				//显示播放器
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

			}
		},

		methods: {
			goPath(index) {
				console.log('index ==>', index)
				for(var i = 0; i < this.playlists.length; i++) {
					if(index == i) {
						var id = this.playlists[i].id
						this.$router.push({ name: 'musiclist', params: { mid: id, creator: this.playlists[i].creator, tag: this.playlists[i].tag } })
					}
				}
			},
			
			getSong(item){
				clearInterval(this.timer)
				this.$store.commit('getSongItem', item)

				this.show = true

				this.songItem = this.$store.state.songItem

				if(this.show) {
					this.timer = setInterval(this.getTime, 1000)
				}
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
			
			goStatus(){
				clearInterval(this.timer)
				this.$router.push({ name: 'player', params: { songItem: this.songItem, time: this.$refs.audio.currentTime,active:'recommendmusic' } })
			}


		},

		created() {

			this.axios({
				method: 'get',
				url: 'https://api.itooi.cn/music/netease/highQualitySongList?key=579621905'
			}).then(data => {

				var playlists = data.data.data.playlists

				this.$store.commit('getPlayLists', playlists)
				//				console.log('this.$store.state.playlists ==>',this.$store.state.playlists)

				this.playlists = playlists.slice(0, 6)
				//				console.log('this.playlists ==>', this.playlists)

				this.$store.commit('getSongId', playlists[0].id)

				//				this.id = this.playlists[this.index].id
				//				localStorage.setItem('songId', this.id)
				this.axios({
					method: 'get',
					url: 'https://api.itooi.cn/music/netease/songList?key=579621905&id=' + this.$store.state.songId
				}).then(data => {
					this.newSongs = data.data.data.songs
					//最新歌单
					this.newSongs = this.newSongs.slice(0, 9)
					this.$store.commit('getSongs',this.newSongs)
				})

			})

		},

		mounted() {
	//定时更新
/*
			this.timer = setInterval(() => {

				var playlists = this.$store.state.playlists
				for(var i = 0; i < playlists.length; i++) {

					++this.index

					var lastLength = parseInt(playlists.length - 1)
					if(this.index >= lastLength) {
						this.index = 0
					}
				}

				this.id = this.$store.state.playlists[this.index].id //				console.log('this.id ==>',this.id)

				this.axios({
					method: 'get',
					url: 'https://api.itooi.cn/music/netease/songList?key=579621905&id=' + this.id
				}).then(data => {
					this.newSongs = data.data.data.songs

					this.newSongs = this.newSongs.splice(0, 9)

				})
				//半个小时更新一次
			}, 2000)
*/
		
		
		},

		components: {
			[Row.name]: Row,
			[Col.name]: Col,
			[Slider.name]:Slider
		}
	}
</script>

<style lang="less" scoped="scoped">
	.hotmusic {
		font-size: 16px;
		.title {
			padding: 0 .1rem;
			border-left: 2px solid #003F96;
		}
		.listBox {
			padding: 0 .03rem .1rem;
			height: 185px;
			.imgBox {
				position: relative;
				padding-bottom: 100%;
				
				img {
					border-radius: 10px;
					position: absolute;
					width: 100%;
					left: 0;
					top: 0;
					z-index: 1;
				}
				span {
					position: absolute;
					right: 0;
					top: 0;
					z-index: 2;
					color: #FFFFFF;
					font-size: 13px;
					padding: .05rem;
				}
			}
			.desc {
				font-size: 13px;
				margin: 0;
				padding: .1rem .1rem;
			}
		}
	}
	
	.newMusic {
		font-size: 16px;
		margin-bottom: .85rem;
		.title {
			padding: 0 .1rem;
			border-left: 2px solid #003F96;
		}
		.newSongList {
			padding: .1rem;
			margin-bottom: .1rem;
			border-bottom: 0.01rem solid #F5F2F0;
			.icon {
				text-align: right;
				i {
					display: inline-block;
					margin-top: .06rem;
					font-size: .7rem;
				}
			}
			.songName {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				font-size: 18px;
				margin-bottom: .15rem;
			}
			.songAuthor {
				font-size: 13px;
				.icon-hot {
					color: red;
					display: inline-block;
					margin-top: .05rem;
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
		
		.singer{
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