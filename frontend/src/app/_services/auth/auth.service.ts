import { Injectable, WritableSignal, computed, effect, signal } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { AuthState } from './auth-state.type';

// Service to manage the authentication state of the user

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authState: WritableSignal<AuthState> = signal<AuthState>({
    user: this.getUser(),
    token: this.getToken(), // get token from localStorage, if there
    isAuthenticated: this.verifyToken(this.getToken()) // verify it's not expired
  })

  user = computed(() => this.authState().user);
  token = computed(() => this.authState().token);
  isAuthenticated = computed(() => this.authState().isAuthenticated);


  constructor() {
    effect( () => {
      const token = this.authState().token;
      const user = this.authState().user;
      if (token !== null) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
      if (user !== null) {
        localStorage.setItem("user", user);
      } else {
        localStorage.removeItem("user");
      }
    });
  }

  updateToken(token: string): void {
    const decodedToken: any = jwtDecode(token);
    const user = decodedToken.user;
    this.authState.set({
      user: user,
      token: token,
      isAuthenticated: this.verifyToken(token)
    })
  }

  getToken() {
    return localStorage.getItem("token");
  }

  getUser() {
    return localStorage.getItem("user");
  }

  verifyToken(token: string | null): boolean {
    if (token !== null) {
      try {
        const decodedToken = jwtDecode(token);
        const expiration = decodedToken.exp;
        if (expiration === undefined || Date.now() >= expiration * 1000) {
          return false; // expiration not available or in the past
        } else {
          return true; //token not expired
        }
      } catch (error) { // invalid token
        return false;
      }
    }
    return false;
  }

  isUserAuthenticated(): boolean {
    return this.verifyToken(this.getToken());
  }

  logout() {
    this.authState.set({
      user: null,
      token: null,
      isAuthenticated: false
    })
  }




}
