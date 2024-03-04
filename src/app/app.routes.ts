import { Routes } from '@angular/router';
import { LandingComponent } from '@views/public/landing/landing.component';
import { InvitationComponent } from '@views/public/invitation/invitation.component';
import { LoginComponent } from '@views/auth/login/login.component';
import { AuthComponent } from '@views/auth/auth.component';
import { AdminComponent } from '@views/admin/admin.component';
import { DashboardComponent } from '@views/admin/dashboard/dashboard.component';
import { GuestsComponent } from '@views/admin/guests/guests.component';
import { CommentsComponent } from '@views/admin/comments/comments.component';
import { authGuard } from '@guards/auth.guard';
import { unauthenticatedGuard } from '@guards/unauthenticated.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'landing',
        pathMatch: 'full'
    },
    {
        path: 'landing',
        component: InvitationComponent
    },
    {
        path: 'invitation/:id',
        component: InvitationComponent
    },
    {
        path: 'auth',
        component: AuthComponent,
        canActivate: [unauthenticatedGuard],
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            },
            {
                path: 'login',
                component: LoginComponent
            }
        ]
    },
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'guests',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                component: DashboardComponent,
            },
            {
                path: 'guests',
                component: GuestsComponent
            },
            {
                path: 'comments',
                component: CommentsComponent
            }
        ]
    }
];
