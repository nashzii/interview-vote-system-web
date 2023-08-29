import {
  Component,
  OnInit,
  ViewChild,
  ViewChildren,
  QueryList,
} from '@angular/core';
import {
  ApiService,
  IGetAllVoteItemResponse,
  IVoteItem,
} from '../services/api.service';
import { LoaderService } from '../services/loader.service';
import { ModalComponent } from '../base/modal/modal.component';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.scss'],
})
export class VotingComponent implements OnInit {
  @ViewChildren(ModalComponent) modalComponents!: QueryList<ModalComponent>;

  @ViewChild('editModal') editModalComponent!: ModalComponent;
  @ViewChild('deleteModal') deleteModalComponent!: ModalComponent;
  @ViewChild('addModal') addModalComponent!: ModalComponent;

  formVoteAdd = {
    name: '',
    description: '',
  };
  formVoteEdit = {
    voteid: '',
    description: '',
  };
  voteItems: IGetAllVoteItemResponse = {
    totalVote: 0,
    voteitem: [],
  };
  state = {
    tabActive: 0,
  };
  tempVoteItems = { ...this.voteItems };
  searchTerm: string = '';
  isLoading = false;
  showMenu: boolean[] = [];
  menuTimeouts: any[] = [];

  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartConfiguration<'bar'>['data'] = {
    datasets: [],
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    indexAxis: 'y',
    responsive: true,
    backgroundColor: '#6419e6',
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    maintainAspectRatio: false,
  };

  constructor(
    private apiService: ApiService,
    private loaderService: LoaderService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.loadData();
    this.loaderService.isLoading$.subscribe({
      next: (isLoad) => {
        this.isLoading = isLoad;
      },
    });
  }

  loadData() {
    this.apiService.getAllVoteItem().subscribe({
      next: (res) => {
        this.voteItems = { ...res };
        this.tempVoteItems = { ...res };
        this.barChartData.labels = this.voteItems.voteitem.map((el) => el.name);
        this.barChartData.datasets = [
          {
            data: this.voteItems.voteitem.map((el) => el.voteCount),
            label: 'vote',
          },
        ];
        console.log(this.barChartData);
        this.searchVoteItem();
      },
    });
  }

  confirmDelete(voteItem: IVoteItem) {
    this.apiService.deleteVoteItem(voteItem.itemId).subscribe({
      next: (res) => {
        this.loadData();
        this.closeModal();
        this.toastr.success('Delete vote.', 'Success')
      },
      error: (error) => {
        this.toastr.error(error.message, 'Error')
      },
    });
  }

  confirmEdit() {
    this.apiService
      .editVoteItem(this.formVoteEdit.voteid, this.formVoteEdit.description)
      .subscribe({
        next: (res) => {
          this.loadData();
          this.closeModal();
          this.toastr.success('Edit vote.', 'Success')
        },
        error: (error) => {
          this.toastr.error(error.message, 'Error')
        },
      });
  }

  confirmAdd() {
    this.apiService
      .addVoteItem(this.formVoteAdd.name, this.formVoteAdd.description)
      .subscribe({
        next: (res) => {
          this.loadData();
          this.closeModal();
          this.toastr.success('Add vote.', 'Success')
        },
        error: (error) => {
          this.toastr.error(error.message, 'Error')
        },
      });
  }

  userVote(voteid: string) {
    this.apiService.uservotes(voteid).subscribe({
      next: () => {
        this.loadData();
      },
      error: () => {},
    });
  }

  calProgress(currentVote: number): number {
    const progress = Math.round((currentVote * 100) / this.voteItems.totalVote);
    return isNaN(progress) ? 0 : progress;
  }

  onMouseEnter(index: number) {
    this.showMenu[index] = true;
    clearTimeout(this.menuTimeouts[index]);
  }

  onMouseLeave(index: number) {
    this.menuTimeouts[index] = setTimeout(() => {
      this.showMenu[index] = false;
    }, 200);
  }

  openAddModal() {
    this.formVoteAdd.name = '';
    this.formVoteAdd.description = '';
    this.addModalComponent.openModal('Add vote item');
  }

  openEditModal(header: string, voteItem: IVoteItem) {
    this.formVoteEdit.voteid = voteItem.itemId;
    this.formVoteEdit.description = voteItem.description;
    this.editModalComponent.openModal(header, voteItem);
  }

  openDeleteModal(header: string, voteItem: IVoteItem) {
    this.deleteModalComponent.openModal(header, voteItem);
  }

  closeModal() {
    this.modalComponents.forEach((el) => {
      el.closeModal();
    });
  }

  searchVoteItem() {
    if (this.searchTerm) {
      const regex = new RegExp(this.searchTerm, 'i');
      this.voteItems.voteitem = this.voteItems.voteitem.filter(
        (el) => regex.test(el.name) || regex.test(el.description),
      );
    } else {
      this.voteItems.voteitem = [...this.tempVoteItems.voteitem];
    }
  }
}
