import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaguicidasComponent } from './plaguicidas.component';

describe('Plaguicidas', () => {
    let component: PlaguicidasComponent;
    let fixture: ComponentFixture<PlaguicidasComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PlaguicidasComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(PlaguicidasComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
