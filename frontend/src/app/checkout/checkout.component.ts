import { Component } from '@angular/core';
import { StepperComponent } from './stepper/stepper.component';

@Component({
    selector: 'app-checkout',
    imports: [StepperComponent],
    templateUrl: './checkout.component.html'
})
export class CheckoutComponent {}
