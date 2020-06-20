import { Component, OnInit } from '@angular/core';
import { TwitchLogApiService } from './twitch-log-api.service';
import { TwitchApiService } from './twitch-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format, formatDistance, formatRelative, subDays } from 'date-fns'
import * as luxon from 'luxon'
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Snwitch';

  errorMessage: string;
  errors: any = [];
  userLog: any = [];
  registerForm: FormGroup;  
  submitted: boolean = false;
  streamer: Object = {data:undefined};
  username: Object = {data:undefined,log_data:{log:[],registered_msgs:0}};

  constructor(private _twitchApiService: TwitchApiService, private _twitchLogApiService: TwitchLogApiService, private formBuilder: FormBuilder) { }

  getUserData(arr) {
    arr.map(obj => {
      this._twitchApiService.getUsers(obj.user).then(user => {
        if (user.length) {
          this._twitchApiService.getStream(obj.user).then(stream => {
            this[`${obj.tgt}`]['data'] = user[0];
            this[`${obj.tgt}`]['stream'] = stream;

            if (this.streamer['data'] !== undefined && this.username['data'] !== undefined) {
              this._twitchApiService.UserFollows(this.username['data']['id'], this.streamer['data']['id']).then(follow => {
                ['username', 'streamer'].map(name => {
                  this[`${name}`]['follow'] = follow[`${name}`]
                })
              })

              this._twitchApiService.getBannedUser(this.streamer['data']['id'], this.username['data']['id']).then(ban => {
                this.username['data']['bans'] = ban;
              }).catch( error => {
                console.log(error.error.error)
              })

              this._twitchApiService.getModerators(this.streamer['data']['id'], this.username['data']['id']).then(r => {
                this.username['channel_status'] = r;
              }).catch( error => {
                console.log(error.error.error)
              })

              this._twitchApiService.getChannelBadge(this.streamer['data']['id'], this.username['data']['id']).then(badges => {
                this[`${obj.tgt}`]['data']['badges'] = badges;
              }).catch( error => {
                console.log(error.error.error)
              })

              this._twitchApiService.checkIfUserIsOnline(this.streamer['data']['login'], this.username['data']['login']).then(status => {
                this['username']['data']['online'] = status;
              })

              this._twitchLogApiService.getLog(this.streamer['data']['login'], this.username['data']['login']).then(log => {
                this.username['log_data'] = log;
              })
            }

            if (this[`${obj.tgt}`]['stream']['type'] === 'live') {
              this._twitchApiService.getGame(this[`${obj.tgt}`]['stream']['game_id']).then(game => {
                this[`${obj.tgt}`]['stream']['game'] = game;
              })
            }

          });
        } else {
          return false;
        }
      })
    })

    console.log(this.streamer, this.username);
  }

  submit(username, streamer) {
    this.getUserData([{tgt:'streamer', user:streamer}, {tgt:'username', user:username}]);
  }


  onSubmit() {
    this.submitted = true;
    this.streamer = {data:undefined};
    this.username = {data:undefined,log_data:{log:[],registered_msgs:0}};
    this._twitchApiService.getChat()

    // parando aqui se o form for invalido
    if (this.registerForm.invalid) {
      return;
    }

    this.submit(this.registerForm.controls.username.value, this.registerForm.controls.streamer.value);
  }

  ngOnInit() {
  	this.registerForm = this.formBuilder.group({
      streamer: ['', Validators.required],
      username: ['', Validators.required]
    });
  }
}
