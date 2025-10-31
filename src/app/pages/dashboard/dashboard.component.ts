import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  users = computed(() => this.auth.getAllUsers())

  constructor(
    public auth: AuthService,
    private router: Router
  ) {}

  handleLogout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  handleNewUser() {
    this.auth.logout();
    this.router.navigate(['/register']);
  }
}