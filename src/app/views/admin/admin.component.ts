import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@components/layout/admin/navbar/navbar.component';
import { SidebarComponent } from '@components/layout/admin/sidebar/sidebar.component';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit{

  constructor() {}

  ngOnInit(): void {
      initFlowbite();
  }

}
