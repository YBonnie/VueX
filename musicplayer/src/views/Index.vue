<template>
	<div class="index wow fadeIn" data-wow-duration="3s">
		<div class="welcome">
			<p class="text wow animated bounceInDown" data-wow-duration="5s">欢迎来到--网易云音乐</p>
			<p class="btn wow animated bounceInDown" data-wow-duration="8s"><span @click="goPath({name:'login'})">登录</span><span @click="goPath({name:'register'})">注册</span></p>
		</div>

	</div>
</template>

<script>
	import animate from '../../node_modules/animate.css'
	import WOW from '../../node_modules/wowjs/dist/wow.js'

	import qs from 'qs'

	export default {
		name: 'Index',
		
		methods:{
			goPath(path){
				this.$router.push(path)
			}
		},

		mounted() { 
			new WOW.WOW().init()
		},

	}
</script>

<style lang="less" scoped="scoped">
	.welcome {
		width: 100%;
		width: 375px;
		height: 667px;
		position: relative;
		top: 0;
		left: 0;
		background: url(../assets/index.gif);
		.text {
			position: absolute;
			top: 38%;
			left: 25%;
			z-index: 5;
			color: #ffff;
			font-size: 24px;
		}
		.btn{
			position: absolute;
			left: 30%;
			top: 50%;
			z-index: 5;
			color: #ffff;
			font-size: 24px;
			span{
				margin: 0 0.35rem;
			}
		}
	}
</style>