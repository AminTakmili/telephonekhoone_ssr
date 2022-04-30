import { Component, OnInit } from "@angular/core";
import { GlobalService } from "../services/global.service";
import { UserBalanceService } from '../services/user-balance.service';

@Component({
  selector: "app-profile-consultant",
  templateUrl: "./profile-consultant.page.html",
  styleUrls: ["./profile-consultant.page.scss"],
})
export class ProfileConsultantPage implements OnInit {
  constructor(public global: GlobalService , public balanceService: UserBalanceService) {}

  ngOnInit() {}
}
