import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MobileComponent } from './mobile.component';

describe('MobileComponent', () => {
  let component: MobileComponent;
  let fixture: ComponentFixture<MobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
