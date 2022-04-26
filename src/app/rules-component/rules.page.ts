import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { GlobalService } from "../services/global.service";

@Component({
  selector: "app-rules",
  templateUrl: "./rules.page.html",
  styleUrls: ["./rules.page.scss"],
})
export class RulesPage implements OnInit {
  data = "";
  loading = false;
  constructor(
    public modalCtrl: ModalController,
    private global: GlobalService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getData();
  }

  getData() {
    this.loading = true;
    this.global.httpGet("more/terms").subscribe(
      (res) => {
        this.data = res.msg;
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        this.global.showError(err);
      }
    );
  }
}
