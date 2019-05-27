import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  	users:[],
  	
  	userLogin:{},
  	
  	//所有歌单
  	playlists:[],
  	
  	//初始化一个歌单Id
  	songId:0,
  	
 		songItem:[],
 		
 		songs:[],
 		
 		//新歌单
 		newSongs:[],
 		
 		//是否播放歌曲
 		play:false,
 		//当前歌单Id
 		mid : 0,
 		//当前歌单作者
 		creator:'',
 		//当前歌单标签
 		tag:'',
 		//当前用户喜欢的歌单
 		userLoveSong:[],
 		//视频信息
 		videoInfo: [],
 		//收藏的额MV
 		loveVideo :[]
  },
  
  mutations: {
  	
  	getUsers(state,value){
  		state.users = value
  	},
  	
  	getuserLogin(state,value){
  		state.userLogin = value
  	},
  	
  	getPlayLists(state,value){
  		state.playlists = value
  	},
  	
  	getSongId(state,value){
  		state.songId = value
  	},
  	
  	getSongItem(state,value){
  		state.songItem = value
  	},
  	
  	getSongs(state,value){
  		state.songs = value
  	},
  	
  	getNewSongs(state,value){
  		state.newSongs = value
  	},
  	
  	getPlay(state,value){
  		state.play = value
  	},
  	
  	getMid(state,value){
  		state.mid = value
  	},
  	
  	getCreator(state,value){
  		state.creator = value
  	},
  	
  	getTag(state,value){
  		state.tag = value
  	},
  	
  	getVideoInfo(state,value){
  		state.videoInfo = value
  	},
  	
  	getLoveVideo(state,value){
  		state.loveVideo = value
  	},
  	
  },
  
  actions: {}
});
