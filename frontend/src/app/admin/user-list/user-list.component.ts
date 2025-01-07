import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../services/user.service';
import { MatCellDef, MatColumnDef, MatTableModule } from '@angular/material/table'
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    imports: [MatTableModule, MatColumnDef, MatCellDef],
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }

}
