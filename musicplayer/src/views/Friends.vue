<template>
	<div class="frineds">
		
		<van-nav-bar
  title="分享"
  left-arrow
  @click-left="onClickLeft"
/>
		
		<p v-if="shareShow" class="shareShow">当前没有分享的歌曲哦！！！</p>
		<van-row class="shareBox" v-for="(item,index) in shareSongs" :key="index">
			<van-col span="24" class="username"><i class="iconfont icon-geshou"></i> {{item.username}} : </van-col>
			<van-col span="24" class="songsItem">
				<img :src="item.songItem.pic" alt="" class="auto-img" />
				<i class="iconfont icon-bofang player" @click="goPath(item.songItem)"></i>
				<i class="iconfont icon-geshou singer">{{item.songItem.singer}}</i>
				<i class="iconfont icon-yinyue songName"> {{item.songItem.name}}</i>
				
			</van-col>
		</van-row>
		
		<div class="miniPlayer" v-if="show">
			<div class="playerBox">
				<van-row>
					<van-col span="4" class="image">
						<div class="imageBox">
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
	import { NavBar,Row, Col ,Collapse, CollapseItem, Slider} from 'vant';
	export default {
		name: 'friends',

		data() {
			return {
				//本地存储的分享歌曲
				shareSongs: [],
				//是否存在分享歌曲
				shareShow: false,
				
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
			}
		},
		
		methods:{
//			player(item){
//				
//				this.songItem = item
//				this.show = true
//			},
			
			onClickLeft(){
				this.$router.go(-1)
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
			//本地存储的分享歌曲
			this.shareSongs = localStorage.getItem('shareSongs')
			this.shareSongs = this.shareSongs == undefined ? [] : JSON.parse(this.shareSongs)
			console.log('this.shareSongs =>', this.shareSongs)
			if(this.shareSongs.length == 0) {
				this.shareShow = true
			}

		},

		components: {
			[Row.name]: Row,
			[Col.name]: Col,
			[Collapse.name]: Collapse,
			[CollapseItem.name]: CollapseItem,
			[Slider.name]: Slider,
			[NavBar.name]:NavBar
		}
	}
</script>

<style lang="less" scoped="scoped">
	.frineds {
		font-size: 16px;
		.shareShow {
			font-size: 20px;
			text-align: center;
			margin-top: 5rem;
		}
		.shareBox {
			padding: .2rem;
			.username {
				font-size: 18px;
				padding-bottom: .1rem;
				i {
					color: #003F96;
					font-size: 25px;
				}
			}
			.songsItem {
				position: relative;
				padding-bottom: 100%;
				img{
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					border-radius: 10px;
				}
				.player {
					position: absolute;
					z-index: 5;
					top:1.5rem;
					left: 50%;
					margin-left: -1.2rem;
					font-size: 150px;
					color: #FFFFFF;
				}
				
				.songName{
					position: absolute;
					z-index: 2;
					top: 0;
					left: 0;
					margin-left: .12rem;
					margin-top: .1rem;
					font-size: 20px;
					color: #FFFFFF;
				}
				.singer{
					position: absolute;
					z-index: 2;
					bottom: 0;
					left: 0;
					margin-left: .1rem;
					margin-bottom: .1rem;
					font-size: 20px;
					color: #FFFFFF;
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
		z-index: 9999;
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
	}
</style>