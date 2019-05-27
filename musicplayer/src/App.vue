<template>
	<div id="app">
		<router-view />
	</div>
</template>
<script type="text/javascript">
	import rem from './utils/rem.js'

	export default {
		name: 'app',

		mounted() {
			rem()
		}
	}
</script>


<style lang="less">
	body {
		padding: 0;
		margin: 0 auto;
	}
	
	#app {
		max-width: 640PX;
		margin: 0 auto;
	}
	
	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	
	.fl {
		float: left;
	}
	
	.fr {
		float: right;
	}
	
	.clearfix {
		overflow: hidden;
		clear: both;
	}
	
	input {
	padding: 0;
		margin: 0;
		border: none;
		/*外面框*/
		outline: none;
		background-color: transparent;
	}
.auto-img{
	width: 100%;
	display: block;
}
</style>