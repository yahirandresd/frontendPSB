import { TestBed } from '@angular/core/testing';

import { EmpresaFumigadora } from './empresa-fumigadora.service';

describe('EmpresaFumigadora', () => {
    let service: EmpresaFumigadora;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EmpresaFumigadora);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
