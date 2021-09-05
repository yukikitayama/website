import { Component, OnDestroy, OnInit, ChangeDetectorRef, HostBinding } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  onAuthUIStateChange,
  CognitoUserInterface,
  AuthState
} from '@aws-amplify/ui-components';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  user: CognitoUserInterface | undefined;
  authState: AuthState
  toggleControl = new FormControl(false);
  // @HostBinding('class') className = '';

  constructor(
    private authService: AuthService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.toggleControl.valueChanges
      .subscribe((darkMode) => {
        console.log(darkMode);
        const darkClassName = 'darkMode';
        // this.className = darkMode ? darkClassName : '';
      });

    onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData as CognitoUserInterface;
      this.ref.detectChanges();
    });

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();

    return onAuthUIStateChange;
  }
}
