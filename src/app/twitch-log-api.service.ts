import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class TwitchLogApiService {
	baseURL: string = "https://cors-anywhere.herokuapp.com/https://overrustlelogs.net";

	constructor(private httpClient: HttpClient) { }

	// requisita o array de meses em que o OverRustleLogs
	// obteve o log do streamer
	private async getChannelMonths(channel) {
		const monthsURL = `${this.baseURL}/api/v1/${channel}/months.json`;
		const data = await this.httpClient.get(monthsURL).toPromise();

		return data;
	}

	// requisita o log do usuario de acordo com o mês referenciado
	private async getUserLog(channel, username, month) {
		const logURL = `${this.baseURL}/${channel}%20chatlog/${month}/userlogs/${username}.txt`;
		const data = await this.httpClient.get(logURL, {responseType: 'text' as 'json'}).toPromise();

		return data;
	}

	// obtem dados (mês e log) utilizando as funções externas
	// acima e, apos lidar e modificar, os retorna como objeto
	public async getLog(channel, username) {  	
		const regexDate = new RegExp(`\\[(.*?)\\] ${username}`);
		const regexMessage = new RegExp(`\\] ${username}: (.*)`);
		let userLog = {log: [], registered_msgs: 0};

		// requisitando meses
		this.getChannelMonths(channel).then((months:Array<any>) => {
			months.map((month) => {
				// requisitando log
				this.getUserLog(channel, username, month).then(messages => {
					let arr = []; 
					let log = [];	

					// dividindo string 'messages' (log completo) em mensagens unicas e as redirecionando
					// para o array 'log'
					log.push(`${messages}`.split(/\n/).filter(function(el) {return el.length != 0}));
					log = [].concat(...log);

					// usando regex para separar a data/hora e mensagem
					for (let i = 0; i < log.length; i++) {
						arr.push({message: regexMessage.exec(log[i])[1], date:regexDate.exec(log[i])[1]});
					}

					const firstMsg = new Date(arr[0].date);
					const lastMsg = new Date(arr[arr.length - 1].date);

					// corrindo data: inverte o array se a primeira mensagem
					// for mais antiga do que a ultima 
					if (firstMsg.getTime() < lastMsg.getTime()) {
						arr.reverse()
					}

					// obtem a quantidade de mensagens em cada iteração do mapa e soma
					userLog['registered_msgs'] = userLog['registered_msgs'] + arr['length'];
					// adicionando objeto com array de mensagens e a respectiva data
					userLog['log'].push({msgs:arr, date: month});
					// organiza o array por data (recente -> antiga)
					userLog['log'].sort(function(a,b){return <any>new Date(b.date) - <any>new Date(a.date)});

				}).catch( error => {
					console.log(`No data archived in ${month}`)
				})
			})
		}).catch( error => {
			console.log(`No data archived for user ${channel} on the OverRustleLogs`)
		}) 

		return userLog;
	}

}