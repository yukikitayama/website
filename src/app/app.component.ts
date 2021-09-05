import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';

import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'website';

  constructor(
    private authService: AuthService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authService.autoAuthUser();
  }

  ngOnDestroy() {
  }
}
