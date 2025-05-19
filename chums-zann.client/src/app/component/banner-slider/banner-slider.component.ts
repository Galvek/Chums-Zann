import { transition, group, animate, query, style, trigger } from '@angular/animations';
import { Component, AfterViewInit, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-banner-slider',
  templateUrl: './banner-slider.component.html',
  styleUrl: './banner-slider.component.scss',
  animations: [
    trigger('bannerAnimation', [
      transition(":increment", group([
        query(':enter', [
          style({ left: '100%' }),
          animate('0.5s ease-out', style('*'))
        ],
          { optional: true }
        ),
        query(':leave', [
          animate('0.5s ease-out', style({ left: '-100%' }))
        ],
          { optional: true }
        )
      ])),
      transition(":decrement", group([
        query(':enter', [
          style({ left: '-100%' }),
          animate('0.5s ease-out', style('*'))
        ],
          { optional: true }
        ),
        query(':leave', [
          animate('0.5s ease-out', style({ left: '100%' }))
        ],
          { optional: true }
        )
      ]))
    ])
  ]
})
export class BannerSliderComponent implements AfterViewInit {
  intervalId: any;

  //TODO need to setup some real banner images, maybe even consider driving this from the database
  slides: any = [
    { image: '../assets/chums-storefront.jpg', alt: 'Image 1', link: '' },
    { image: '../assets/chums-storefront.jpg', alt: 'Image 2', link: '' }
  ];
  currIndex: number = 0;
  actualIndex: number = 0;

  ngAfterViewInit() {
    this.intervalId = setInterval(() => {
      this.currIndex++;
      this.actualIndex++;
      if (this.actualIndex >= this.slides.length) {
        this.actualIndex = 0;
      } else if (this.actualIndex < 0) {
        this.actualIndex = this.slides.length - 1;
      }

    }, 10 * 1000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  get items() {
    return [this.slides[this.actualIndex]];
  }
}
