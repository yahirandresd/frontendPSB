import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-programa-plagas-detail',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`
})
export class ProgramaPlagasDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  programaId!: string;

  ngOnInit(): void {
    this.programaId = this.route.snapshot.params['programaId'];
  }
}
