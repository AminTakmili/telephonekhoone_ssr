import { Component, OnInit } from '@angular/core';
// import {tileLayer, latLng, polygon, Map, marker, icon} from 'leaflet';
import { GlobalService } from '../services/global.service';
import { MapService } from '../services/map.service';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {
  zoom = 16;
  lat = 32.6548766;
  lng = 51.6647008;
  map: any;
  title = 'creativenerd-map-tutorial';
  mapMarker: any;
  markericon: any;

  //! center = latLng([this.lat, this.lng]);
  tels = [];
  addresses = [];
  mails = [];
  // !map: Map;
  tel = [];
  description = '';
  address = [];
  email = [];
  whatsapp = [];
  youtube = [];
  telegram = [];
  instagram = [];
  socials = [];
  twitter = [];
  facebook = [];
  parts;
  show_map = '0';
  // !options = {
  //     layers: [
  //         tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
  //             maxZoom: 20,
  //             attribution: '',
  //             subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  //         }),
  //     ],
  //     zoom: this.zoom,
  //     center: latLng(this.lat, this.lng),
  //     preferCanvas: true,
  //     zoomControl: false,
  // };
  // mapMarker = marker([this.lat, this.lng], {
  //     icon: icon({
  //         iconSize: [21, 28],
  //         iconAnchor: [50, 96],
  //         iconUrl: 'assets/img/map-marker.png',
  //         // shadowUrl: 'assets/marker-shadow.png',
  //     }),
  // });
  breadCrumb = [
    { url: '/', name: 'تلفن خونه' },
    { url: '/contact-us', name: 'تماس با ما' },
  ];

  constructor(
    private global: GlobalService,
    private mapService: MapService,
    public seo: SeoService
  ) {
    // console.log('object');
  }

  ngOnInit() {
    // !this.center = latLng([this.lat, this.lng]);
    // // this.map.panTo([this.lat, this.lng]);
    // this.mapMarker.setLatLng([this.lat, this.lng]);
    this.getData();
  }

  getData() {
    this.global.showLoading().then(() => {
      this.global.httpGet('more/contact').subscribe(
        (res) => {
          console.log(res.seo);
          this.global.dismisLoading();
          this.description = res.description;
          this.socials = res.socials;
          res.result.map((item) => {
            const tel = {} as Items;
            tel.title = item.title;
            tel.type = item.type;
            tel.value = item.value;
            switch (item.type) {
              case 'tel':
                this.tels.push(tel);
                break;
              case 'address':
                this.addresses.push(tel);
                break;
              case 'mail':
                this.mails.push(tel);
                break;
            }
          });
          this.lat = res.location.lat;
          this.lng = res.location.lng;
          this.title = res.location.title;
          this.global.SSRsetTimeout(() => {
            // this.map.panTo([this.lat, this.lng]);
            // this.mapMarker.setLatLng([this.lat, this.lng]);
            // this.map.addLayer(this.mapMarker);
            this.global.dismisLoading();
            if (this.mapService.L) {
              this.setupMap();
            }
          }, 200);
          this.setSeo({
            metaTitle: res['seo']?.title,
            metaDescription: res['seo']?.description,
            metaKeywords: res['seo']?.keywords,
            isNoIndex: false,
          });
        },
        (err) => {
          this.global.showError(err);
        }
      );
    });
  }

  // async setupMap() {
  // 	setTimeout(() => {
  // 		if (!this.map) {
  // 			this.map = this.mapService.L.map('map', { zoomDelta: 0.5, zoomSnap: 0, maxZoom: 21, drawControl: false, scrollWheelZoom: false }).setView([this.lat, this.lng], this.zoom);
  // 			this.mapService.L.tileLayer(
  // 				'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
  // 				{
  // 					maxZoom: 21,
  // 					attribution: 'AtriaTech - AtriaShop',
  // 					subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],

  // 				}
  // 			).addTo(this.map);
  // 			var century21icon = this.mapService.L.icon({
  // 				iconUrl: '../assets/extra/img/custom-marker.png',
  // 				iconSize: [50, 50],
  // 				iconAnchor: [25,50],
  // 				popupAnchor: [0, -50],
  // 			});
  // 			const marker = this.mapService.L.marker([this.lat, this.lng], { icon: century21icon }).addTo(this.map);
  // 			marker.bindPopup("<div class='map-popup'>" + this.title + "</div>").openPopup();

  // 		}
  // 	}, 1000);

  // }

  onMapReady(map: any) {
    this.global.SSRsetTimeout(() => {
      map.invalidateSize();
    }, 500);
  }

  private async setupMap() {
    // console.log(this.map);
    if (!this.map) {
      // console.log(this.map,"true");
      this.map = this.mapService.L.map('map', {
        scrollWheelZoom: 'center',
      }).setView([this.lat, this.lng], this.zoom);
      this.mapService.L.tileLayer(
        'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
        {
          maxZoom: 19,
          attribution: 'AtriaTech - َAtriaShop',
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        }
      ).addTo(this.map);

      this.markericon = this.mapService.L.icon({
        iconSize: [50, 50],
        iconAnchor: [25, 30],
        // popupAnchor: [0, 0],
        iconUrl: '/assets/icons/location-telephonkhone-svg.svg',
      });
      this.mapMarker = this.mapService.L.marker([this.lat, this.lng], {
        icon: this.markericon,
        title: this.title,
      }).addTo(this.map);

      // this.mapMarker.bindPopup("<div class='map-popup'>" + this.title + "</div>").openPopup();

      this.map.on('load', this.onMapReady(this.map));
      // console.log(this.map,"true");
    }

    //   this.map = leaflet.map('map', {
    //     center: [51.505, -0.09],
    //     zoom: 13
    // });
  }

  setSeo(data) {
    this.seo.generateTags({
      title: data.metaTitle,
      description: data.metaDescription,
      keywords: data.metaKeywords,
      image: 'src/assets/img/professional.png',
      isNoIndex: data.isNoIndex,
    });
  }

  // onMapReady(event: Map) {
  //     // this.map = event;
  //     this.global.SSRsetTimeout(() => {
  //         this.map.panTo([this.lat, this.lng]);
  //         event.invalidateSize();
  //     }, 1000);
  // }
}

interface Items {
  title: string;
  type: string;
  value: string;
}
