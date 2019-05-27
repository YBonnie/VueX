<template>
	<div class="main">

		<!--<van-tabbar v-model="active" active-color="#003F96" class="menu" :fixed="false">
			<van-tabbar-item v-for="(item,index) in list" :key="index" :class="item.class" :icon="item.icon" @click="goPath(item)">{{item.title}}</van-tabbar-item>
		</van-tabbar>-->

		<div class="header">
			<van-row class="nav-box">
				<van-col span="2"><i class="iconfont icon-caidan" @click="clickPopup"></i></van-col>
				<van-col span="20">
					<van-col span="6" :class="{'active':item.isActive}" v-for="(item,index) in list" :key="index" @click.native="goPath(item,index)">{{item.title}}</van-col>

				</van-col>
				<van-col span="2"><i class="iconfont icon-iconset0157" @click="searchBtn"></i></van-col>

			</van-row>

		</div>

		<div class="main-content">
			<router-view></router-view>
		</div>

		<van-popup v-model="show" position="left" class="van-popup--right">
			<div class="personInfo">

				<van-nav-bar :title="userName" left-arrow @click-left="onClickLeft" />

				<div class="headSculpture">
					<img src="../assets/headSculpture.jpg" class="auto-img" alt="" />
				</div>
				<div class="editInfo">
					<van-row>
						<van-col class="van-col" span="24" @click.native="editInfo">修改个人信息</van-col>
						<van-col class="van-col" span="24" @click.native="goLogin">切换用户</van-col>
						<van-col class="van-col" span="24" @click.native="quit">退出登录</van-col>
					</van-row>
				</div>
			</div>
		</van-popup>

		<van-actionsheet v-model="Actionsheetshow">
			<van-cell-group class="group1">
				<van-field label="账号" v-model="currentUserInfo.username" left-icon="manager-o" class="username" />
				<van-field ref="password1" type="password" label="密码" v-model="currentUserInfo.pwd" right-icon="eye-o" @click-right-icon="changeType" left-icon="browsing-history-o" class="password" />
				<van-field ref="password2" type="password" label="确认密码" v-model="currentUserInfo.pwd" right-icon="eye-o" @click-right-icon="changeType" left-icon="browsing-history-o" class="password2" />
				<van-field label="手机号码" v-model="currentUserInfo.phone" left-icon="phone-o" class="phone" />
			</van-cell-group>
			<van-button size="large" @click="editUserInfo">修改</van-button>
		</van-actionsheet>
	</div>
</template>

<script>
	import {Dialog,Toast, Button, Field, CellGroup, Tabbar, TabbarItem, Row, Col, Popup, Collapse, CollapseItem, Icon, NavBar, Actionsheet } from 'vant'
	import tool from '../utils/tool.js'
	import tip from '../utils/tip.js'
	import validForm from '../utils/validForm.js'
	export default {
		name: 'Main',

		components: {
			[Tabbar.name]: Tabbar,
			[TabbarItem.name]: TabbarItem,
			[Row.name]: Row,
			[Col.name]: Col,
			[Popup.name]: Popup,
			[Collapse.name]: Collapse,
			[CollapseItem.name]: CollapseItem,
			[Icon.name]: Icon,
			[NavBar.name]: NavBar,
			[Actionsheet.name]: Actionsheet,
			[Field.name]: Field,
			[CellGroup.name]: CellGroup,
			[Button.name]: Button,
			[Toast.name]:Toast,
			[Dialog.name]:Dialog

		},

		data() {
			return {

				index: 1,

				list: [
					{ title: '我的', isActive: false, path: { name: 'mymusic' }, flag: '/mymusic' },
					{ title: '发现', isActive: true, path: { name: 'recommendmusic' }, flag: '/recommendmusic' },
					{ title: '朋友', isActive: false, path: { name: 'friends' }, flag: '/friends' },
					{ title: '视频', isActive: false, path: { name: 'Video' }, flag: '/video' },
				],

				//弹出层是否显示
				show: false,

				activeNames: ['1'],
				//上拉菜单
				Actionsheetshow: false,
				//当前登录用户信息
				userId: 0,
				userName: '',

				users: [],
				//当前用户
				currentUserInfo: [],

				//是否显示密码
				pwdShow: false,

			}
		},

		methods: {
			goPath(item, index) {

				item.isActive = true

				this.list[this.index].isActive = false

				this.index = index
				this.$router.push(item.path)
			},

			searchBtn() {
				this.$router.push({ name: 'searchmusic' })
			},

			//显示弹出层
			clickPopup() {
				this.show = true
			},

			editInfo() {
				this.Actionsheetshow = true
			},

			onClickLeft() {
				this.show = false
			},

			//上拉框取消
			onCancel() {
				this.Actionsheetshow = false
			},

			//显示密码
			changeType() {
				this.pwdShow = !this.pwdShow
				if(this.pwdShow) {
					this.$refs.password1.type = null
					this.$refs.password2.type = null
				} else {
					this.$refs.password1.type = 'password'
					this.$refs.password2.type = 'password'
				}

			},

			//修改当前用户
			editUserInfo() {
				if(!validForm.validUsername(this.currentUserInfo.username)) {
					tip.dialogList('账号格式不正确', '账号只支持4-12位的英文字符', true, this.currentUserInfo, 'username')
				} else if(!validForm.validPwd(this.currentUserInfo.password, 6, 8)) {
					tip.dialogList('密码格式不正确', '密码只支持！@.,_和6-8个数字字母组合', true, this.currentUserInfo, 'pwd')
				} else if(!validForm.validPhone(this.currentUserInfo.phone)) {
					tip.dialogList('手机号码不正确', '请重新输入', true, this.currentUserInfo, 'phone')
				} else {
					//用户信息
					
					console.log('this.currentUserInfo.userId =>',this.currentUserInfo.userId)
					var userInfo = {
						userId: this.currentUserInfo.userId,
						username: this.currentUserInfo.username,
						pwd: this.currentUserInfo.pwd,
						phone: this.currentUserInfo.phone,
						registerTime: tool.format(new Date(), 'yyyy-MM-dd hh:mm:ss')
					}
					for(var i = 0 ; i <this.users.length ; i++){
						
						if(this.users[i].userId == userInfo.userId){
							this.users[i].userId = userInfo.userId
							this.users[i].username = userInfo.username
							this.users[i].pwd = userInfo.pwd
							this.users[i].phone = userInfo.phone
							this.users[i].registerTime = userInfo.registerTime
						}
						
					}
					
					Toast('信息修改成功');
					
					localStorage.setItem('users',JSON.stringify(this.users))
					
					var userLogin = JSON.parse(localStorage.getItem('userLogin'))
					userLogin.userId = this.currentUserInfo.userId
					userLogin.username = this.currentUserInfo.username
					localStorage.setItem('userLogin',JSON.stringify(userLogin))
					this.Actionsheetshow = false
				}

			},
			
			//切换用户
			goLogin(){
				this.$router.push({name:'login'})
			},
			
			//退出登录
			quit() {
				var userLogin = JSON.parse(localStorage.getItem('userLogin'))
				//				console.log('userLogin ==>', userLogin)

				Dialog.confirm({
					title: '退出提醒',
					message: '你确定要退出吗？'
				}).then(() => {
					userLogin = {}
					localStorage.setItem('userLogin', JSON.stringify(userLogin))
					this.$router.push({ name: 'Login' })
				}).catch(() => {
					return
				});

			}
		},

		created() {
			var pathname = location.pathname;
			console.log('pathname ==>', pathname)

			for(var i = 0; i < this.list.length; i++) {
				this.list[i].isActive = false;

				if(pathname.indexOf(this.list[i].flag) > -1) {

					this.list[i].isActive = true;
				}
			}

			this.userId = JSON.parse(localStorage.getItem('userLogin')).userId

			this.userName = JSON.parse(localStorage.getItem('userLogin')).username
			this.users = JSON.parse(localStorage.getItem('users'))
			for(var i = 0; i < this.users.length; i++) {
				if(this.userId == this.users[i].userId) {
					this.currentUserInfo = this.users[i]
				}
			}
			console.log('currentUserInfo =>', this.currentUserInfo)
		},

	}
</script>

<style lang="less" scoped="scoped">
	.header {
		font-size: 16px;
		padding: .1rem 0;
		box-sizing: border-box;
		.active {
			font-weight: bolder;
			font-size: 18px;
			margin-top: -2px;
		}
		.nav-box {
			text-align: center;
		}
	}
	
	.van-popup--right {
		width: 100%;
		height: 100%;
		top: 50%;
		left: 0;
		bottom: auto;
		right: auto;
		.headSculpture {
			width: 200px;
			height: 200px;
			margin: 1rem auto;
			padding: 0;
			border-radius: 50%;
			overflow: hidden;
		}
		.editInfo {
			font-size: 16px;
			.van-col {
				text-align: center;
				height: 1rem;
				line-height: 1rem;
				border-bottom: 1px solid #CCCCCC;
			}
		}
	}
</style>