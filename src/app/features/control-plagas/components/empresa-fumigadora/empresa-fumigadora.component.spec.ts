import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaFumigadoraComponent } from './empresa-fumigadora.component';

describe('EmpresaFumigadora', () => {
    let component: EmpresaFumigadoraComponent;
    let fixture: ComponentFixture<EmpresaFumigadoraComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EmpresaFumigadoraComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(EmpresaFumigadoraComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
