import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CheckOrderPage } from './check-order.page';

describe('CheckOrderPage', () => {
  let component: CheckOrderPage;
  let fixture: ComponentFixture<CheckOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckOrderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
