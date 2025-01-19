import { PaymentMethodComponent } from './../payment-method/payment-method.component';
import { Component, OnInit } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { BasketComponent } from "../basket/basket.component";
import { CardComponent } from "../card/card.component";
import { NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-stepper',
    imports: [MatStepperModule, BasketComponent, CardComponent, PaymentMethodComponent, NgIf,MatButton],
    templateUrl: './stepper.component.html',
    styleUrls: ['./stepper.component.scss']
})
export class StepperComponent {
  selectedPaymentMethod: string = '';

  onPaymentMethodSelected(method: string) {
    this.selectedPaymentMethod = method;
  }
}

