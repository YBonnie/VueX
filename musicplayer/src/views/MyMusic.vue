<template>
	<div class="mymusic animated fadeIn">

		<van-collapse v-model="activeNames" accordion>
			
			<van-collapse-item :name="(index+1)" v-for="(item,index) in menuList" :key="index" >
				<div slot="title" class="title"><i class="iconfont" :class="item.className"></i> {{item.title}}（{{item.count}}）</div>
				<div @click="goPath(item)">{{item.textContent}}</div>
			</van-collapse-item>

		</van-collapse>

	</div>
</template>

<script>
	import animate from '../../node_modules/animate.css'
	import { Collapse, CollapseItem } from 'vant';

	export default {
		name: 'mymusic',

		data() {
			return {
				//折叠面板的active
				activeNames: '1',
				//本地音乐总数
				localMusicCount: 2,
				//最近播放音乐总数
				recentMusicCount: 12,
				//下载的音乐总数
				downloadMusicCount: 2,
				//我的电台总数
				radioStation: 1,
				//我的收藏总数
				myCollectionCount: 12,
				
				//menuList
				menuList:[
				{title:'本地音乐',count:2,className:'icon-yinyue',textContent:'点击进入本地音乐'},
				{title:'最近播放',count:12,className:'icon-bofang1',textContent:'点击进入最近播放'},
				{title:'下载管理',count:2,className:'icon-xiazai1',textContent:'点击进入下载管理'},
				{title:'我的电台',count:1,className:'icon-xianxing_diantai',textContent:'点击进入我的电台'},
				{title:'我的收藏',count:5,className:'icon-linedesign-06',textContent:'点击进入我的收藏',path:{name:'collectmusic'}},
				]
				

			}

		},
		
		methods:{
			goPath(item){
				this.$router.push(item.path)
			}
		},

		

		components: {
			[Collapse.name]: Collapse,
			[CollapseItem.name]: CollapseItem,
		}
	}
</script>

<style lang="less" scoped="scoped">
	.title {
		color: #000000;
		i {
			margin-right: .2rem;
			display: inline-block;
		}
	}
</style>