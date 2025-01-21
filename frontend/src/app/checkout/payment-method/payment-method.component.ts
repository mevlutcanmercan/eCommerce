import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-payment-method',
    imports: [FormsModule, ReactiveFormsModule,MatButton],
    templateUrl: './payment-method.component.html',
    styleUrl: './payment-method.component.scss'
})
export class PaymentMethodComponent {
  @Output() selectedMethod = new EventEmitter<string>();

  onSelectPaymentMethod(method: string) {
    this.selectedMethod.emit(method);
  }
}
