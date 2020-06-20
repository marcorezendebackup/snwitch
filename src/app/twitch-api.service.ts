import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as luxon from 'luxon'

@Injectable({
  providedIn: 'root'
})
export class TwitchApiService {
  token: string = 'gwrprpns8fidgm69w3ckeiv5svxpks';
  baseURLHelix: string = "https://api.twitch.tv/helix";
  baseURLKraken: string = "https://cors-anywhere.herokuapp.com/https://api.twitch.tv/kraken";
  baseURLTMI: string = "https://cors-anywhere.herokuapp.com/https://tmi.twitch.tv/group/user";
  headers = new HttpHeaders()
	  .set('Client-ID', this.token)
	  .set('Accept',  'application/vnd.twitchtv.v5+json')

  constructor(private httpClient: HttpClient) { }

  // scope: none

  public async getUsers(channel) {

	const data = await this.httpClient.get(`${this.baseURLHelix}/users?login=${channel}`, { headers: this.headers }).toPromise();

	return data['data'];
  }

  public async getStream(channel) {

   	const stream = await this.httpClient.get(`${this.baseURLHelix}/streams?user_login=${channel}`, { headers: this.headers }).toPromise();
   	
   	if (stream['data']['length']) {
	   	if (stream['data'][0]['type'] === 'live') {
	        const now = luxon.DateTime.local();
	        const following = luxon.DateTime.fromISO(stream['data'][0]['started_at']);
	        const time = now.diff(following, ['days', 'hours']).toObject();

	        time['hours'] = luxon.Duration.fromObject({hours:time.hours}).toFormat('hh:mm:ss');

	        stream['data'][0]['uptime'] = time;
	    }
   	} else {
		stream['data'].push({type:'offline'});
   	}

    return stream['data'][0];
  }

  public async getGame(id) {

	const data = await this.httpClient.get(`${this.baseURLHelix}/games?id=${id}`, { headers: this.headers }).toPromise();

	return data['data'][0];
  }

  public async UserFollows(username_id, channel_id) {

  	const username =  await this.httpClient.get(`${this.baseURLHelix}/users/follows?from_id=${username_id}&to_id=${channel_id}`, { headers: this.headers }).toPromise();
  	const streamer = await this.httpClient.get(`${this.baseURLHelix}/users/follows?from_id=${channel_id}&to_id=${username_id}`, { headers: this.headers }).toPromise();

  	let arr = [{username,tgt:'username',username_obj:{status: false}}, {streamer,tgt:'streamer',streamer_obj:{status: false}}];

  	arr.map((obj,i) => {
  		if (obj[`${obj.tgt}`]['data']['length']) {
  			const now = luxon.DateTime.local();
            const following = luxon.DateTime.fromISO(obj[`${obj.tgt}`]['data'][0]['followed_at']);
            const time = now.diff(following, ['years', 'months', 'days', 'hours']).toObject();

            time['hours'] = luxon.Duration.fromObject({hours:time.hours}).toFormat('hh:mm:ss');

  			obj[`${obj.tgt}_obj`] = obj[`${obj.tgt}`]['data'][0];
  			obj[`${obj.tgt}_obj`]['time_following'] = time;
  			obj[`${obj.tgt}_obj`]['status'] = true;
  		}
  	})
  	return {username:arr[0]['username_obj'],streamer:arr[1]['streamer_obj']};
  }

  public async checkIfUserIsOnline(channel, username) {

  	const data = await this.httpClient.get(`${this.baseURLTMI}/${channel}/chatters`, { headers: this.headers }).toPromise();
  	const viewers =  data['chatters']['viewers'].concat(
  		data['chatters']['vips'],
  		data['chatters']['moderators'],
  		data['chatters']['staff'],
  		data['chatters']['admins'],
  		data['chatters']['global_mods']
  	)

  	for (let i = 0; i < viewers.length; i++) {
  		if (viewers[i] === username) {
  			return true;
  		}
  	}

  	return false;
  }

  // scope: chat

  public async getChannelBadge(channel_id, username_id) {

	const data = await this.httpClient.get(`${this.baseURLKraken}/users/${username_id}/chat/channels/${channel_id}/badges`, { headers: this.headers }).toPromise();

	return data['data'][0];
  }  

  // scope: moderation

  public async getBannedUser(channel_id, username_id) {

	const data = await this.httpClient.get(`${this.baseURLHelix}/moderation/banned?broadcaster_id=${channel_id}&user_id${username_id}`, { headers: this.headers }).toPromise();

	return data['data'][0];
  }  

  public async getModerators(channel_id, username_id) {

	const data = await this.httpClient.get(`${this.baseURLHelix}/moderation/moderators?broadcaster_id=${channel_id}&user_id${username_id}`, { headers: this.headers }).toPromise();

	return data['data'][0];
  }

  public async getChatAll(next) {
    const data = await this.httpClient.get(`https://api.twitch.tv/v5/videos/607353318/comments?cursor=${next}`, { headers: this.headers }).toPromise();
    return data
  }

  public async getChatM() {

    const data = await this.httpClient.get(`https://api.twitch.tv/v5/videos/607353318/comments`, { headers: this.headers }).toPromise();
    return data
  }  

  public async getChat() {

    let next = ""
    let arr = []

    let data = await this.httpClient.get(`https://api.twitch.tv/v5/videos/607353318/comments`, { headers: this.headers }).toPromise();

    //do {
      //data.then((r) => {
        //next = r['_next']
        //arr.push(next)
        //data = this.getChatAll(next)
      //})       
    //} 


    do {
        console.log(data);
        next = data['_next']
        arr.push(next)

        data = await this.httpClient.get(`https://api.twitch.tv/v5/videos/607353318/comments?cursor=${next}`, { headers: this.headers }).toPromise();
     
    } while (next !== null)
    // const first_next = data['_next'];

    console.log("A",arr);
  }  
}
