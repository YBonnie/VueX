<template>
	<div class="searchMusic animated fadeIn">
		<van-nav-bar title="查找歌曲" left-arrow @click-left="onClickLeft">
		</van-nav-bar>

		<van-search ref="search" v-model="searchValue" placeholder="请输入搜索关键词" show-action shape="round" @search="onSearch()">
			<div slot="action" @click="onSearch">搜索</div>
		</van-search>

		<div class="tags" v-if="searchResultShow">
			<p>搜索历史</p>
			<ul class="tag-row clearfix">
				<li class="tag-col fl" v-for="(item,index) in this.searchHistory[this.userId]" @click="getText(item)">{{item}}</li>
			</ul>
		</div>

		<div class="songlist" v-if="searchResultShow">
			<van-row class="listBox" v-for="(item,index) in songss" :key="index" :ref="'van' + index" @click.native="goPath(item)">
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

		<div class="songlist" v-if="musicShow">
			<van-row class="listBox" v-for="(item,index) in searchMusicResult" :key="index" :ref="'van' + index" @click.native="goPath(item)">
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
	import animate from '../../node_modules/animate.css'
	import { Search, NavBar, Toast, Row, Col, Slider } from 'vant';

	export default {
		name: 'searchmusic',
		data() {
			return {
				songs: [],
				//查询的值
				searchValue: '',
				//是否显示查询的历史记录
				searchResultShow: true,

				musicShow: false,

				userId: '',
				//查询的理事记录
				searchHistory: {},
				//当前耳朵歌曲
				songItem: [],

				allSongs: [],

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

				//startIndex
				startIndex: 0,
				//endIndex
				endIndex: 10,

				songss: [],

				searchMusicResult: [],

				show: false
			}
		},

		methods: {
			onClickLeft() {
				this.$router.go(-1)
			},

			onSearch() {
				if(this.searchValue == '' || this.searchValue == undefined) {
					Toast('搜索关键不能为空');
					return
				}
				this.searchResultShow = false;
				this.musicShow = true

				if(!this.searchHistory[this.userId]) {
					this.searchHistory[this.userId] = []

				} else if(this.searchHistory[this.userId].length > 10) {

					this.searchHistory[this.userId].shift();

				}
				if(this.searchHistory[this.userId].indexOf(this.searchValue) === -1) {

					this.searchHistory[this.userId].push(this.searchValue)
					localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory))
				}

				for(var i = 0; i < this.$store.state.songs.length; i++) {
					if(this.searchValue == this.$store.state.songs[i].name) {
						this.searchMusicResult = [this.$store.state.songs[i]]
					} else {
						Toast('没有你要找的歌曲哦');
						this.searchResultShow = true;
						return
					}
				}

			},

			getText(item) {
				this.searchValue = item
				this.onSearch()
			},
			goStatus() {
				clearInterval(this.timer)
				this.$router.push({ name: 'player', params: { songItem: this.songItem, time: this.$refs.audio.currentTime, active: true } })
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

			var playlists = this.$store.state.playlists

			//获取用户id
			this.userId = JSON.parse(localStorage.getItem('userLogin')).userId;

			//获取当前用户的本地存储搜索历史记录
			var searchHistoryData = localStorage.getItem('searchHistory');

			this.searchHistory = searchHistoryData == undefined ? {} : JSON.parse(searchHistoryData);

			playlists.forEach(value => {
				this.axios({
					method: 'get',
					url: 'https://api.itooi.cn/music/netease/songList?key=579621905&id=' + value.id
				}).then(data => {

					//当前歌单的所有歌曲
					var songs = data.data.data.songs
					//所有歌单的歌曲
					//					this.songs.push(songs)
					songs.forEach(value => {
						this.songs.push(value)
						this.$store.commit('getSongs', this.songs)
					})
					this.allSongs = this.$store.state.songs

					this.songss = this.allSongs.slice(this.startIndex, this.endIndex)

				})
			})

		},

		mounted() {
			//页面自动聚焦
			this.$refs.search.querySelector('input').focus()

		},

		components: {
			[Search.name]: Search,
			[NavBar.name]: NavBar,
			[Toast.name]: Toast,
			[Row.name]: Row,
			[Col.name]: Col,
			[Slider.name]: Slider
		},

	}
</script>

<style lang="less" scoped="scoped">
	.searchMusic {
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
		font-size: 16px;
		.tags {
			padding: 0.4rem;
			p {
				font-size: 17PX;
			}
			.tag-col {
				margin-right: 0.4rem;
				background-color: #f2f2f2;
				max-width: 6.933rem;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				margin-top: 0.2rem;
				padding: 0.1rem;
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
		/*尾部*/
	}
</style>