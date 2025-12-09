import { Component } from '@angular/core';

@Component({
  selector: 'app-la-ban',
  standalone: false,
  templateUrl: './la-ban.html',
  styleUrl: './la-ban.scss',
})
export class LaBan {
  currentHeading = 0;

  sectorCenters = [0, 45, 90, 135, 180, 225, 270, 315];

  fengShuiMap: Record<number, string> = {
    0: 'Hướng Bắc',
    45: 'Đông Bắc',
    90: 'Đông',
    135: 'Đông Nam',
    180: 'Nam',
    225: 'Tây Nam',
    270: 'Tây',
    315: 'Tây Bắc',
  };

  dragging = false;
  sensorActive = false;

  ngAfterViewInit() {
    this.drawTicks();
    this.attachDragEvents();
  }

  /** --- TÍNH GÓC --- */
  normalize(d: number) {
    return ((d % 360) + 360) % 360;
  }

  getDirectionName(d: number) {
    d = this.normalize(d);
    if (d >= 337.5 || d < 22.5) return 'Bắc (N)';
    if (d < 67.5) return 'Đông-Bắc (NE)';
    if (d < 112.5) return 'Đông (E)';
    if (d < 157.5) return 'Đông-Nam (SE)';
    if (d < 202.5) return 'Nam (S)';
    if (d < 247.5) return 'Tây-Nam (SW)';
    if (d < 292.5) return 'Tây (W)';
    return 'Tây-Bắc (NW)';
  }

  getNearestSector(h: number) {
    let min = 999,
      best = 0;
    for (const c of this.sectorCenters) {
      const diff = Math.abs(((h - c + 540) % 360) - 180);
      if (diff < min) {
        min = diff;
        best = c;
      }
    }
    return best;
  }

  /** --- VẼ TICKS --- */
  drawTicks() {
    const ticks = document.querySelector('#ticks') as SVGGElement;
    if (!ticks) return;
    ticks.innerHTML = '';

    for (let d = 0; d < 360; d += 5) {
      const len = d % 45 === 0 ? 6 : d % 10 === 0 ? 4 : 2;
      const rad = (d * Math.PI) / 180;
      const rOut = 95;
      const rIn = rOut - len;

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', (rIn * Math.sin(rad)).toString());
      line.setAttribute('y1', (-rIn * Math.cos(rad)).toString());
      line.setAttribute('x2', (rOut * Math.sin(rad)).toString());
      line.setAttribute('y2', (-rOut * Math.cos(rad)).toString());
      line.setAttribute('stroke', 'rgba(255,255,255,0.06)');
      ticks.appendChild(line);
    }
  }

  /** --- DRAG XOAY LA BÀN --- */
  attachDragEvents() {
    const compass = document.getElementById('compass');
    if (!compass) return;

    const getAngle = (e: any) => {
      const rect = compass.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const x = e.clientX;
      const y = e.clientY;
      return this.normalize((Math.atan2(x - cx, cy - y) * 180) / Math.PI);
    };

    compass.addEventListener('pointerdown', (ev) => {
      this.dragging = true;
      compass.setPointerCapture(ev.pointerId);
    });

    window.addEventListener('pointermove', (ev) => {
      if (!this.dragging) return;
      this.currentHeading = getAngle(ev);
    });

    window.addEventListener('pointerup', () => {
      this.dragging = false;
    });
  }

  /** --- SENSOR --- */
  async enableSensor() {
    if (this.sensorActive) {
      this.sensorActive = false;
      return;
    }

    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const p = await (DeviceOrientationEvent as any).requestPermission();
        if (p !== 'granted') return alert('Không được cấp quyền cảm biến');
      } catch {
        return alert('Trình duyệt từ chối cảm biến');
      }
    }

    window.addEventListener('deviceorientation', (e: any) => {
      if (e.alpha != null) {
        this.currentHeading = this.normalize(360 - e.alpha);
      }
    });

    this.sensorActive = true;
  }

  reset() {
    this.currentHeading = 0;
  }
}
