class RouterComponents{
	constructor() {

	}
	
	index(resolve) {
		return require(['@/views/Index'], resolve)
	}
	main(resolve) {
		return require(['@/views/Main'], resolve)
	}
	register(resolve) {
		return require(['@/views/Register'], resolve)
	}
	login(resolve) {
		return require(['@/views/Login'], resolve)
	}
	music(resolve) {
		return require(['@/views/Music'], resolve)
	}
	recommendmusic(resolve) {
		return require(['@/views/Recommendmusic'], resolve)
	}
	musiclist(resolve) {
		return require(['@/views/Musiclist'], resolve)
	}
	player(resolve) {
		return require(['@/views/Player'], resolve)
	}
	mymusic(resolve) {
		return require(['@/views/MyMusic'], resolve)
	}
	collectmusic(resolve) {
		return require(['@/views/CollectMusic'], resolve)
	}
	hotmusic(resolve) {
		return require(['@/views/HotMusic'], resolve)
	}
	searchmusic(resolve) {
		return require(['@/views/SearchMusic'], resolve)
	}
	video(resolve) {
		return require(['@/views/Video'], resolve)
	}
	friends(resolve) {
		return require(['@/views/Friends'], resolve)
	}
	
	
	
	
}
export default new RouterComponents()