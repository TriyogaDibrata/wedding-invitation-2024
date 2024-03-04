import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiResponse } from '@interfaces/api-response';
import { Comment } from '@interfaces/comment';
import { AlertService } from '@services/alert.service';
import { RequestsService } from '@services/requests.service';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, DataTablesModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent implements OnInit{

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  isDtInitialized:boolean = false;

  comments : Comment[];
  comment : Comment;

  constructor(private request : RequestsService, private alert : AlertService) {}

  ngOnInit(): void {

  }

  ngAfterViewInit() : void {
    this.dtOptions = {
      pagingType: 'full_numbers',
    };
    this.getCommments();
  }

  async getCommments() {
    const comments = await this.request.reqGet('comment').subscribe({
      next: (res : ApiResponse) => {
        this.comments = res.result;
        if (this.isDtInitialized) {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next("");
          });
        } else {
          this.isDtInitialized = true
          this.dtTrigger.next("");
        }
      }
    })
  }

  async deleteGuest(id) {
    await this.request.reqDelete('comment', id).subscribe({
      next: (res : ApiResponse) => {
        if(res && res.success) {
          this.alert.showAlert('success', "Deleted", "Guest has been deleted !");
          this.getCommments();
        }
      }
    })
  }

  confirmDelete(comment : Comment) {
    Swal.fire({
      title: "",
      text: "Are you sure to remove this ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteGuest(comment.id);
      }
    });
  }
}
