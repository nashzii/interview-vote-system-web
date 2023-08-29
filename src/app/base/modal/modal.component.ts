import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { IVoteItem } from 'src/app/services/api.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @ViewChild('modal') modalRef!: ElementRef;
  @Output() onSubmit: EventEmitter<any> = new EventEmitter<any>(); // Output event emitter

  header: string = '';
  data: any = {};

  executeFunction() {
    // Your function logic here
    console.log('Function executed from modal component.');
  }

  openModal(header: string, data?: any) {
    this.header = header;
    this.data = data;
    const modalElement = this.modalRef.nativeElement as HTMLDialogElement;
    modalElement.showModal();
  }

  closeModal() {
    const modalElement = this.modalRef.nativeElement as HTMLDialogElement;
    modalElement.close();
  }

  confirm() {
    this.onSubmit.emit(this.data);
  }
}
