import { Component, OnInit } from '@angular/core';
import {LoginService} from '../../login.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-representative',
  templateUrl: './representative.component.html',
  styleUrls: ['./representative.component.css']
})
export class RepresentativeComponent implements OnInit {

  constructor(private loginService: LoginService, private router: Router) { }

    title = 'demo';
    error = '';
    user = {
        username : '',
        password : ''
    };

    clickMe() {
        if (this.user.username.replace(/\s/g, '') === '' && this.user.password.replace(/\s/g, '') === '') {
            this.error = 'all';
        } else if (this.user.username.replace(/\s/g, '') === '') {
            this.error = 'username';
        } else if (this.user.password.replace(/\s/g, '') === '') {
            this.error = 'password';
        }  else {
            this.error = '';

            const obs = this.loginService.loginAsRep(this.user);
            obs.subscribe((x: {token: ''}) => {
                if (x.hasOwnProperty('token')) {
                    this.error = '';
                    console.log('now logged in');
                    localStorage.setItem('data', JSON.stringify({'token' : x.token, 'username' : this.user.username, 'role' : 'rep'}));
                    this.router.navigate(['/rep']);
                } else {
                    this.error = 'notfound';
                }
            }, (error1) => {
                this.error = 'notfound';
            });
        }
    }

  ngOnInit() {
  }

}
