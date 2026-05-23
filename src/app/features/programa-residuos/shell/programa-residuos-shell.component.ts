import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-programa-residuos-shell',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
    templateUrl: './programa-residuos-shell.component.html',
    styleUrls: ['./programa-residuos-shell.component.scss']
})
export class ProgramaResiduosShellComponent {}
