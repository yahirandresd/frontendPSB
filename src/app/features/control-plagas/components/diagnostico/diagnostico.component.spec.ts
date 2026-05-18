import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticoComponent } from './diagnostico.component';

describe('Diagnostico', () => {
    let component: DiagnosticoComponent;
    let fixture: ComponentFixture<DiagnosticoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DiagnosticoComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(DiagnosticoComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
