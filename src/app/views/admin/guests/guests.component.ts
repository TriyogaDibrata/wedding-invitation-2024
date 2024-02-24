import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';

@Component({
  selector: 'app-guests',
  standalone: true,
  imports: [CommonModule, DataTablesModule],
  templateUrl: './guests.component.html',
  styleUrl: './guests.component.scss'
})
export class GuestsComponent {

}
