import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShareModulePage } from './share-module.page';

describe('ShareModulePage', () => {
  let component: ShareModulePage;
  let fixture: ComponentFixture<ShareModulePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareModulePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShareModulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
