import { Component, Input, OnInit } from "@angular/core";
import { PopoverController } from "@ionic/angular";
//! import { Country } from "src/app/login/login.page";

@Component({
  selector: "app-countries-popover",
  templateUrl: "./countries-popover.component.html",
  styleUrls: ["./countries-popover.component.scss"],
})
export class CountriesPopoverComponent implements OnInit {
  //! @Input() list: Country[];
  @Input() list: any;
  searchTerm: any = "";
  constructor(private popoverController: PopoverController) {}
  setSearchItems() {
    if (this.searchTerm === "") {
      return this.list;
    } else {
      return this.list.filter((item) => {
        if (!item.phone_code) {
          return (
            item.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1
          );
        } else {
          return (
            item.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) >
              -1 ||
            item.phone_code.toString().indexOf(this.searchTerm.toLowerCase()) >
              -1
          );
        }
      });
    }
  }
  ngOnInit() {}
  //! selectCountry(item: Country) {
  //   this.popoverController.dismiss(item);
  // }
   selectCountry(item: any) {
    this.popoverController.dismiss(item);
  }
}
