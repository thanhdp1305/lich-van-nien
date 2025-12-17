import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('lich-van-nien');

  tabs = [
    { label: 'Tra cứu', icon: 'search', route: '/lich-am/tra-cuu/ngay' },
    { label: 'Lịch tháng', icon: 'calendar_check', route: '/lich-am/tra-cuu/thang' },
    { label: 'La bàn', icon: 'explore', route: '/lich-am/la-ban' },
    // { label: 'Notify', icon: 'bi bi-bell', route: '/notify' },
    // { label: 'Profile', icon: 'bi bi-person', route: '/profile' },
    // { label: 'Setting', icon: 'bi bi-gear', route: '/setting' }
  ];
}
