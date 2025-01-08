import { AdminItem, ContentService, UserItem } from './../services/content.service';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../shared/navbar/navbar.component";
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-layout',
    imports: [NavbarComponent, RouterOutlet],
    template: `
  <app-navbar></app-navbar>
  <router-outlet></router-outlet>
`,
    styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
  public adminNavigationItems: AdminItem[] = [];
  public userNavigationItems: UserItem[] = [];

  currentItem: AdminItem | UserItem = {
    text: '',
    path: '',
    class: ''
  };

  constructor(private router: Router, private route: ActivatedRoute, private contentService: ContentService) {}

  ngOnInit(): void {
  }

}
