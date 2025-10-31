import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'dashboard',
        pathMatch:'full'

    },
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'dashboard',
        component:DashboardComponent,
        canActivate:[authGuard]
    }
];
