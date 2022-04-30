import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { UserBalanceService } from '../services/user-balance.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(public global: GlobalService , public balanceService: UserBalanceService) { }

  ngOnInit() {
  }

}
