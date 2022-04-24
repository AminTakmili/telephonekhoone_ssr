import { Component, Input, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-plan-detail",
  templateUrl: "./plan-detail.component.html",
  styleUrls: ["./plan-detail.component.scss"],
})
export class PlanDetailComponent implements OnInit {
  @Input() item;
  constructor(private modalcontroller: ModalController) {}
  dismiss() {
    this.modalcontroller.dismiss();
  }
  ngOnInit() {}
}
