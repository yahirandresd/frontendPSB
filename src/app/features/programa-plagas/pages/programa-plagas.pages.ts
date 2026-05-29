import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ProgramaPlagasService } from '../services/control-plagas.service';
import { ProgramaPlagas } from '../models/programa-plagas';
import { ProgramaPlagasFormComponent } from '../components/programa-plagas.component';
 
interface SeccionModulo {
    label: string;
    descripcion: string;
    icono: string;
    ruta: string;
    color: string;
}
 
interface Estadistica {
    label: string;
    valor: number | null;
    icono: string;
    color: string;
}
 
@Component({
    selector: 'app-programa-plagas-page',
    standalone: true,
    imports: [
        CommonModule, RouterModule, ButtonModule, CardModule,RouterOutlet,
        TagModule, ToastModule, SkeletonModule, DialogModule,
        ProgramaPlagasFormComponent
    ],
    providers: [MessageService],
    templateUrl: './programa-plagas.pages.html'
})
export class ProgramaPlagasPageComponent implements OnInit {
    private service        = inject(ProgramaPlagasService);
    private route          = inject(ActivatedRoute);
    private router         = inject(Router);
    private messageService = inject(MessageService);
    private cdr            = inject(ChangeDetectorRef);
 
    programa: ProgramaPlagas | null = null;
    id: string = '';
    cargando      = false;
    cargandoStats = false;
    mostrarFormulario = false;
 
    estadisticas: Estadistica[] = [
        { label: 'Registros',   valor: null, icono: 'pi pi-clipboard',   color: 'bg-blue-100 text-blue-700'    },
        { label: 'Hallazgos',   valor: null, icono: 'pi pi-search',       color: 'bg-yellow-100 text-yellow-700' },
        { label: 'Trampas',     valor: null, icono: 'pi pi-th-large',     color: 'bg-orange-100 text-orange-700' },
        { label: 'Acciones',    valor: null, icono: 'pi pi-check-circle', color: 'bg-green-100 text-green-700'  },
        { label: 'Áreas',       valor: null, icono: 'pi pi-map-marker',   color: 'bg-purple-100 text-purple-700' },
        { label: 'Plaguicidas', valor: null, icono: 'pi pi-box',          color: 'bg-red-100 text-red-700'      }
    ];
 
    readonly secciones: SeccionModulo[] = [
        { label: 'Registros de Control',    descripcion: 'Actividades de inspección, fumigación y revisión de trampas', icono: 'pi pi-clipboard',   ruta: 'registro-plagas',      color: 'border-blue-300 hover:border-blue-500'   },
        { label: 'Áreas',                   descripcion: 'Zonas del establecimiento bajo control de plagas',            icono: 'pi pi-map-marker',   ruta: 'area-plagas',          color: 'border-purple-300 hover:border-purple-500' },
        { label: 'Plaguicidas',             descripcion: 'Productos autorizados y sus condiciones de uso',              icono: 'pi pi-box',          ruta: 'plaguicidas',          color: 'border-red-300 hover:border-red-500'       },
        { label: 'Empresas fumigadoras',    descripcion: 'Empresas autorizadas para el control de plagas',              icono: 'pi pi-building',     ruta: 'empresa-fumigadora',   color: 'border-blue-300 hover:border-blue-500'    },
        { label: 'Tipos de plagas',         descripcion: 'Clasificación y caracterización de plagas',                   icono: 'pi pi-sitemap',      ruta: 'tipo-plaga',           color: 'border-orange-300 hover:border-orange-500' },
        { label: 'Cronogramas',             descripcion: 'Programación de actividades y seguimientos',                  icono: 'pi pi-calendar',     ruta: 'cronograma',           color: 'border-green-300 hover:border-green-500'   },
        { label: 'Diagnósticos de plagas',  descripcion: 'Inspecciones, hallazgos y análisis',                          icono: 'pi pi-search',       ruta: 'diagnostico-plagas',   color: 'border-purple-300 hover:border-purple-500' }
    ];
 
    ngOnInit(): void {
        // ← Lee :programaId de la ruta actual
        this.id = this.route.snapshot.paramMap.get('programaId')
               ?? this.route.snapshot.paramMap.get('id')
               ?? '';
        this.cargarPrograma();
        this.cargarEstadisticas();
    }
 
    cargarPrograma(): void {
        if (!this.id) return;
        this.cargando = true;
        this.service.obtener(this.id).subscribe({
            next: (data) => {
                this.programa = data;
                this.cargando = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.cargando = false;
                this.cdr.detectChanges();
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el programa' });
            }
        });
    }
 
    cargarEstadisticas(): void {
        if (!this.id) return;
        this.cargandoStats = true;
        this.service.obtenerEstadisticas(this.id).subscribe({
            next: (stats) => {
                this.estadisticas[0].valor = stats.totalRegistros;
                this.estadisticas[1].valor = stats.totalHallazgos;
                this.estadisticas[2].valor = stats.totalTrampas;
                this.estadisticas[3].valor = stats.totalAcciones;
                this.estadisticas[4].valor = stats.totalAreas;
                this.estadisticas[5].valor = stats.totalPlaguicidas;
                this.cargandoStats = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.cargandoStats = false;
                this.cdr.detectChanges();
            }
        });
    }
 
    navegarA(ruta: string): void {
        // ← Navega relativo al :programaId actual, no a la raíz del módulo
        this.router.navigate([ruta], { relativeTo: this.route });
    }
 
    onGuardado(): void {
        this.mostrarFormulario = false;
        this.cargarPrograma();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Programa actualizado correctamente' });
    }
}
