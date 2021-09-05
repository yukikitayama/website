import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';

@Component({
  selector: 'app-amplify-signin',
  templateUrl: './amplify-signin.component.html',
  styleUrls: ['./amplify-signin.component.scss']
})
export class AmplifySigninComponent implements OnInit, OnDestroy {
  authState: AuthState;

  constructor(
    private router: Router,
    private ref: ChangeDetectorRef,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.ref.detectChanges();
      if (this.authState === 'signedin') {
        // https://stackoverflow.com/questions/53645534/navigation-triggered-outside-angular-zone-did-you-forget-to-call-ngzone-run
        this.ngZone.run(() => this.router.navigate(['/']));
      }
    });
  }

  ngOnDestroy() {
    return onAuthUIStateChange;
  }
}
