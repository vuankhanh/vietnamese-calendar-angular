import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, QueryList, ViewChild, ViewChildren, inject } from '@angular/core';
import { SwiperContainer, register } from 'swiper/element/bundle';
import { Swiper } from 'swiper';
import { MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { PinchZoomComponent } from '@meddv/ngx-pinch-zoom';
import { MaterialModule } from '../../../shared/module/material';
import { IAlbum } from '../../../shared/interface/media.interface';
import { ActivatedRoute } from '@angular/router';

register();

@Component({
  selector: 'app-slides',
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.scss'],
  standalone: true,
  imports: [
    MaterialModule,
    PinchZoomComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SlidesComponent {
  public readonly data = inject(MAT_DIALOG_DATA) as IAlbum;
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;
  @ViewChildren(PinchZoomComponent) pinchZoomComponents!: QueryList<PinchZoomComponent>;
  private readonly activatedRoute = inject(ActivatedRoute);
  zoomLevel = 1;

  private readonly indexQueryParams = this.activatedRoute.snapshot.queryParams['index'];
  currentIndex: number = this.indexQueryParams ? parseInt(this.indexQueryParams, 10) : 0;

  ngOnInit() { }

  ngAfterViewInit() {
    const swiperParams = {
      initialSlide: this.currentIndex,
      zoom: true,
      pagination: true,
      on: {
        realIndexChange: (swiper: Swiper) => {
          this.realIndexChange(swiper);
        }
      },
    };

    Object.assign(this.swiper.nativeElement, swiperParams);
    this.swiper.nativeElement.initialize();
  }

  realIndexChange(swiper: Swiper) {
    this.currentIndex = swiper.realIndex;
  }

  onZoom(zoom: number) {
    this.zoomLevel = zoom;
    const swiperEl = this.swiper.nativeElement as any;
    if (swiperEl && swiperEl.swiper) {
      swiperEl.swiper.allowTouchMove = zoom <= 1;
    }
  }

  async share(gallery: IAlbum) {
    const url = `${window.location.origin}/album?route=${gallery.route}&index=${this.currentIndex}`;
    const title = gallery.name;
    const text = `Check out this album: ${gallery.name}`;
    if (navigator.canShare && navigator.canShare({ title, text, url })) {
      await navigator.share({ title, text, url });
    }
  }
}
