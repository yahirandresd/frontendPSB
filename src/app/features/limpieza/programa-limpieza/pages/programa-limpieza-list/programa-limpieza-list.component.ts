import { Component, inject, OnInit, signal } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LucideAngularModule, LUCIDE_ICONS, LucideIconProvider, Wrench, FlaskConical, ClipboardList, FileText } from 'lucide-angular';
import { ProgramaLimpiezaService } from '../../services/programa-limpieza.service';
import { ProgramaLimpieza } from '../../models/programa-limpieza.interface';
import { ProgramaService } from '@/app/features/programa/services/programa.service';

interface LimpiezaModule {
    label: string;
    icon: string;
    route: string;
    description: string;
}

@Component({
    selector: 'app-programa-limpieza-list',
    standalone: true,
    imports: [
        RouterModule, TableModule, ButtonModule, CardModule, AccordionModule,
        ConfirmDialogModule, ToastModule, SlicePipe, LucideAngularModule
    ],
    providers: [
        ConfirmationService, MessageService,
        { provide: LUCIDE_ICONS, useValue: new LucideIconProvider({ Wrench, FlaskConical, ClipboardList, FileText }), multi: true }
    ],
    templateUrl: './programa-limpieza-list.component.html',
    styleUrls: ['./programa-limpieza-list.component.scss']
})
export class ProgramaLimpiezaListComponent implements OnInit {
    private service = inject(ProgramaLimpiezaService);
    private programaService = inject(ProgramaService);
    private router = inject(Router);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    private programaMap = new Map<string, string>();

    programas = signal<ProgramaLimpieza[]>([]);
    cargando = signal(true);

    modules: LimpiezaModule[] = [
        { label: 'Equipos y Áreas',    icon: 'wrench',        route: '/limpieza/equipos',            description: 'Equipos, áreas y utensilios de limpieza' },
        { label: 'Productos Químicos', icon: 'flask-conical', route: '/limpieza/productos-quimicos', description: 'Productos autorizados con registro INVIMA' },
    ];

    async ngOnInit(): Promise<void> {
        await this.cargar();
    }

    async cargar(): Promise<void> {
        this.cargando.set(true);
        try {
            const [programas, planes] = await Promise.all([
                firstValueFrom(this.service.getAll()),
                firstValueFrom(this.programaService.getAll()).catch(() => [])
            ]);
            this.programaMap.clear();
            planes.forEach(p => this.programaMap.set(p.id, p.planPsb?.nombre ?? p.nombre ?? '—'));
            this.programas.set(programas);
        } finally {
            this.cargando.set(false);
        }
    }

    nombrePrograma(programaId: string): string {
        return this.programaMap.get(programaId) ?? programaId.slice(0, 8) + '…';
    }

    irAVer(id: string): void {
        this.router.navigate(['/limpieza/programas', id]);
    }

    irAEditar(id: string): void {
        this.router.navigate(['/limpieza/programas', id, 'editar']);
    }

    confirmarEliminar(programa: ProgramaLimpieza): void {
        this.confirmationService.confirm({
            message: '¿Eliminar este programa de limpieza?',
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => this.eliminar(programa.id)
        });
    }

    private async eliminar(id: string): Promise<void> {
        try {
            await firstValueFrom(this.service.delete(id));
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Programa eliminado correctamente' });
            await this.cargar();
        } catch {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el programa' });
        }
    }
}
