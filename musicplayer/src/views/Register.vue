<template>

	<div class="registerBox wow fadeInDown" data-wow-duration="3s">

		<van-nav-bar title="注册" left-text="返回" right-text="登录" left-arrow @click-left="onClickLeft" @click-right="onClickRight" :fixed="true" />
		<van-cell-group class="group1">
			<van-field label="账号" v-model="reg1.username" placeholder="请输入账号" left-icon="manager-o" class="username" />
			<van-field type="password" label="密码" v-model="reg1.password" placeholder="请输入密码(8-16位)" left-icon="browsing-history-o" class="password" />
			<van-field type="password" label="确认密码" v-model="reg1.surePassword" placeholder="请输入确认密码" left-icon="browsing-history-o" class="password2" />

			<van-field label="手机号码" v-model="reg1.phone" placeholder="请输入手机号码" left-icon="phone-o" right-icon="question-o" class="phone" />

			<van-field v-model="reg1.sms" label="短信验证码" placeholder="请输入短信验证码" class="code">
				<van-button slot="button" size="small" class="smallBtn" @click="SendValidCode" :disabled="isDisabled">{{validText}}</van-button>
			</van-field>
		</van-cell-group>
		<van-button class="register-box" size="large" @click="register">登 录</van-button>
	</div>

</template>

<script>
	import animate from '../../node_modules/animate.css'

	import WOW from '../../node_modules/wowjs/dist/wow.js'

	import { Row, Col, CellGroup, Field, Button, NavBar } from 'vant';

	import validForm from '../utils/validForm.js'

	import tip from '../utils/tip.js'

	import tool from '../utils/tool.js'

	export default {
		name: 'register',
		data() {
			return {
				active: 0,

				isShow: false,
				isDisabled: false,
				//随机生成验证码
				validCode: '',
				//validText
				validText: '发送验证码',

				//用户列表
				users: null,

				reg1: {
					username: '',
					password: '',
					surePassword: '',
					phone: '',
					sms: ''
				},

				users: []
			}
		},
		methods: {
			register() {

				//先判断手机号码验证是否通过，如果不通过
				if(!validForm.validPhone(this.reg1.phone)) {
					tip.dialogList('手机号码不正确', '请重新输入', true, this.reg1, 'phone')
				} else if(!validForm.validPwd(this.reg1.password, 6, 8)) {
					tip.dialogList('密码格式不正确', '密码只支持！@.,_和6-8个数字字母组合', true, this.reg1, 'password')
				} else if(!validForm.validUsername(this.reg1.username)) {
					tip.dialogList('账号格式不正确', '账号只支持4-12位的英文字符', true, this.reg1, 'username')
				} else if(!validForm.validSurePwd(this.reg1.password, this.reg1.surePassword)) {
					tip.dialogList('与第二次输入密码不同', '请重新设置', true, this.reg1, 'surePassword')
				} else if(this.reg1.sms.length == 6 && !validForm.validSurePwd(this.reg1.sms, this.validCode)) {
					tip.dialogList('验证码不正确', '请重新设置', true, this.reg1, 'sms')

				} else {
					//存储之前先要验证是否存在该用户
					for(var i = 0; i < this.users.length; i++) {
						if(this.users[i].username == this.reg1.username) {
							tip.dialogList('用户账号已经存在');
							return;
						}
					}

					var time = new Date();
					var userId = time.getTime();
					var phone = this.reg1.phone;
					var username = this.reg1.username;
					var pwd = this.reg1.password;
					var registerTime = tool.format(time, 'yyyy-MM-dd hh:mm:ss')

					var user = {
						userId,
						username,
						pwd,
						phone,
						registerTime
					}

					var data = JSON.parse(localStorage.getItem("users") || '[]')
//					var data = JSON.parse(this.$store.state.users || '[]')

					data.push(user);
					var userData = JSON.stringify(data)
					//					console.log('userData ==>', userData)

					this.$store.commit('getUsers', data)
					console.log('this.$store.state.users==>', this.$store.state.users)

					//					写入本地
					localStorage.setItem('users', userData)

					this.$router.push({ name: 'login' })
				}

			},

			SendValidCode() {
				if(!validForm.validPhone(this.reg1.phone)) {

					tip.dialogList('手机号码不正确', '请重新输入', true, this.reg1, 'phone')
				} else {
					this.validCode = validForm.generatingCode()

					this.isDisabled = true;
					var time = 5;
					this.validText = time + 's后重新发送'
					var timer = setInterval(() => {

						if(time <= 0) {
							this.isDisabled = false;
							clearInterval(timer);
							this.validText = "发送验证码"
							time = null;
						} else {

							this.validText = --time + 's后重新发送'
						}
					}, 1000)
					console.log(this.validCode)
				}

			},

			onClickLeft() {
				this.$router.go(-1)
			},

			onClickRight() {
				this.$router.push({ name: 'login' })
			}

		},
		mounted() {
			new WOW.WOW().init()

			
		},
		components: {

			[Row.name]: Row,
			[Col.name]: Col,
			[CellGroup.name]: CellGroup,
			[Field.name]: Field,
			[Button.name]: Button,
			[NavBar.name]: NavBar
		}
	}
</script>

<style lang="less" scoped="scoped">
	.registerBox {
		padding: 0 0.4rem;
		overflow: hidden;
		.group1 {
			background-color: transparent;
			margin-top: 0.667rem;
			overflow: hidden;
		}
		.username,
		.password,
		.password2,
		.code,
		.phone,
		.register-box {
			margin-top: 0.667rem;
			background-color: transparent;
			border-bottom: 0.027rem solid #003F96;
		}
		.register-box {
			margin-top: 0.933rem;
			border: 0.027rem dashed #003F96;
			background-color: #003F96;
			color: #FFFFFF;
			margin-bottom: 1rem;
			font-size: 18px;
		}
		.smallBtn {
			background-color: #003F96;
			color: #FFFFFF
		}
	}
</style>