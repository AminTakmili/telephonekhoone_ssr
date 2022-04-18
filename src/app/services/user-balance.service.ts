import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { StorageService } from "./storage.service";

@Injectable({
  providedIn: "root",
})
export class UserBalanceService {
  userBalance = new BehaviorSubject<number>(null
    // parseInt(localStorage.getItem("userBalance"), 10)
  );
  constructor(
    private Storage: StorageService,

  ) {
    this.Storage.get('userBalance').then((val) => {
			this.userBalance.next(parseInt(val,10)) ;
		});
  }

  setUserBalance(balance: number) {
    this.userBalance.next(balance);
    // this.Storage.set("userBalance", `${balance}`);
  }

  getUserBalance() {
    return this.userBalance;
  }
}
