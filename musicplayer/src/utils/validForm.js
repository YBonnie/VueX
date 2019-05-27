import {Toast } from 'vant';
export default{
	//验证手机号
	validPhone(value){
		return /^1[3456789]\d{9}$/.test(value)
	},
	
	//验证密码[!@.,\w]
	validPwd(value,min,max){
		return new RegExp('[!@\\.,\\w]{'+min+','+max+'}').test(value)
	},
	
	//验证注册账号
	validUsername(value){
		
		var users = localStorage.getItem('users')
		users = users == undefined ? [] : JSON.parse(users)
		if(users.length == 0){
			return /^[A-Za-z]{4,12}$/.test(value)
			
		}else{
			for(var i = 0 ; i < users.length; i++){
			if(users[i].username == value){
				Toast('改用户名已经存在请重新输入');
				return false
			}else{
				return /^[A-Za-z]{4,12}$/.test(value)
			}
		}
		}
		
		
	},
	//验证登录
	validUsernameLogin(value){
		
				return /^[A-Za-z]{4,12}$/.test(value)
		
	},
	
	//检验第二次输入密码是否和第一次相同
	validSurePwd(value1,value2){
		//直接判断两值是否相等
		return Object.is(value1,value2)
	},
	
	//验证码生成
	generatingCode(){
		//时间戳   截取末尾的4个字符串
		var time = new Date().getTime().toString().substr(-3,3)
		var random = Math.random().toString().substr(-3,3)
		return time.concat(random);
	}
}
