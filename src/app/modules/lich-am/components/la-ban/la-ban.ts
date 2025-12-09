import { Component, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-la-ban',
  standalone: false,
  templateUrl: './la-ban.html',
  styleUrl: './la-ban.scss',
})
export class LaBan implements AfterViewInit, OnDestroy {
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
  private deviceOrientationHandler?: (e: any) => void;

  ngAfterViewInit() {
    setTimeout(() => {
      this.drawTicks();
      this.attachDragEvents();
    }, 0);
  }

  ngOnDestroy() {
    if (this.deviceOrientationHandler) {
      window.removeEventListener('deviceorientation', this.deviceOrientationHandler);
    }
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

    const getAngle = (e: MouseEvent | TouchEvent | PointerEvent) => {
      const rect = compass.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      let x: number, y: number;
      if ('touches' in e && e.touches.length > 0) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      } else if ('clientX' in e) {
        x = e.clientX;
        y = e.clientY;
      } else {
        return this.currentHeading;
      }

      // Tính góc từ tâm đến điểm click (0° = Bắc, tăng theo chiều kim đồng hồ)
      const angle = Math.atan2(x - cx, cy - y) * (180 / Math.PI);
      return this.normalize(angle);
    };

    const handleStart = (ev: MouseEvent | TouchEvent | PointerEvent) => {
      this.dragging = true;
      if ('pointerId' in ev && 'setPointerCapture' in compass) {
        (compass as any).setPointerCapture((ev as PointerEvent).pointerId);
      }
      ev.preventDefault();
    };

    const handleMove = (ev: MouseEvent | TouchEvent | PointerEvent) => {
      if (!this.dragging) return;
      this.currentHeading = getAngle(ev);
      ev.preventDefault();
    };

    const handleEnd = () => {
      this.dragging = false;
    };

    // Pointer events (modern browsers)
    compass.addEventListener('pointerdown', handleStart);
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleEnd);

    // Mouse events (fallback)
    compass.addEventListener('mousedown', handleStart);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);

    // Touch events (mobile)
    compass.addEventListener('touchstart', handleStart);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleEnd);
  }

  /** --- SENSOR --- */
  async enableSensor() {
    if (this.sensorActive) {
      this.sensorActive = false;
      if (this.deviceOrientationHandler) {
        window.removeEventListener('deviceorientation', this.deviceOrientationHandler);
        this.deviceOrientationHandler = undefined;
      }
      return;
    }

    // Kiểm tra hỗ trợ DeviceOrientationEvent
    if (!window.DeviceOrientationEvent) {
      alert('Trình duyệt không hỗ trợ cảm biến la bàn');
      return;
    }

    // iOS 13+ yêu cầu permission
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission !== 'granted') {
          alert('Không được cấp quyền cảm biến. Vui lòng cấp quyền trong cài đặt trình duyệt.');
          return;
        }
      } catch (error) {
        alert('Không thể yêu cầu quyền cảm biến');
        return;
      }
    }

    // Xử lý dữ liệu từ cảm biến
    this.deviceOrientationHandler = (e: DeviceOrientationEvent) => {
      if (e.alpha != null) {
        // alpha: 0-360, tăng theo chiều kim đồng hồ khi xoay ngược chiều kim đồng hồ
        // Chuyển đổi để 0° = Bắc, tăng theo chiều kim đồng hồ
        this.currentHeading = this.normalize(360 - e.alpha);
      }
    };

    window.addEventListener('deviceorientation', this.deviceOrientationHandler);
    this.sensorActive = true;
  }

  reset() {
    this.currentHeading = 0;
  }
}
