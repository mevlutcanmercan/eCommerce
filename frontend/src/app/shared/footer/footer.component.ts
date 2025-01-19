import { LINKS } from './../../constants';
import { Component} from '@angular/core';
import { LucideAngularModule,Github,Linkedin } from 'lucide-angular';
@Component({
  selector: 'app-footer',
  imports: [LucideAngularModule] ,
   templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})

export class FooterComponent {
  readonly links = LINKS;
  readonly Github = Github;
  readonly Linkedin = Linkedin;

}
