import { Injectable, signal } from '@angular/core';

export interface Credentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = signal<any>(null);

  constructor() {
    const session = localStorage.getItem('AUTHENTICATION');
    if (session) {
      const parsed = JSON.parse(session);
      this.user.set({
        name: parsed.name || 'Usuario',
        email: parsed.email
      });
    }
  }

  private getUsers(): RegisterData[] {
    const raw = localStorage.getItem('USERS');
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  private saveUsers(users: RegisterData[]) {
    localStorage.setItem('USERS', JSON.stringify(users));
  }

  register(data: RegisterData): { ok: boolean; msg?: string } {
    const users = this.getUsers();
    const exists = users.find(u => u.email === data.email);
    if (exists) {
      return { ok: false, msg: 'El email ya está registrado' };
    }
    users.push(data);
    this.saveUsers(users);
    return { ok: true };
  }

  login(credentials: Credentials): { ok: boolean; msg?: string } {
    const users = this.getUsers();
    const found = users.find(
      u => u.email === credentials.email && u.password === credentials.password
    );
    if (!found) {
      return { ok: false, msg: 'Credenciales incorrectas' };
    }
    localStorage.setItem('AUTHENTICATION', JSON.stringify(found));
    this.user.set({
      name: found.name,
      email: found.email
    });
    return { ok: true };
  }

  logout() {
    localStorage.removeItem('AUTHENTICATION');
    this.user.set(null);
  }

  getAllUsers() {
    return this.getUsers().map(u => ({ name: u.name, email: u.email }));
  }

  isAuthenticated() {
    return !!localStorage.getItem('AUTHENTICATION');
  }
}