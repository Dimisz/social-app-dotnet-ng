import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Nav } from '../layout/nav/nav';
import { AccountService } from '../core/services/account-service';
import { Home } from '../features/home/home';
import { User } from '../types/user';
import { Router, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [Nav, RouterOutlet, NgClass],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private accountService = inject(AccountService);
  protected router = inject(Router);
  private http = inject(HttpClient);
  protected readonly title = signal('Social App');
  protected members = signal<User[]>([]);

  async ngOnInit() {
    this.members.set(await this.getMembers());
    // this.http.get("https://localhost:7007/api/members").subscribe({
    //   next: response => this.members.set(response),
    //   error: error => console.error(error),
    //   complete: () => console.log('completed the http request')
    // })
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString);
    this.accountService.currentUser.set(user);
  }

  async getMembers() {
    try {
      return lastValueFrom(this.http.get<User[]>("https://localhost:7007/api/members"));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
