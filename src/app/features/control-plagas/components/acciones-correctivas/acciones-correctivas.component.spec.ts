import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccionesCorrectivasComponent } from './acciones-correctivas.component';

describe('AccionesCorrectivas', () => {
    let component: AccionesCorrectivasComponent;
    let fixture: ComponentFixture<AccionesCorrectivasComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AccionesCorrectivasComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(AccionesCorrectivasComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
