import Vue from 'vue'
import {Dialog} from 'vant';
Vue.use(Dialog);

export default {
	dialogList(title,message, isBoolean, o, params) {
		Dialog.alert({
			title,
			message
		}).then(() => {
			if(typeof isBoolean == 'boolean' && isBoolean){
				o[params] = ''
			}
		});
	}
}