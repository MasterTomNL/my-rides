import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mahjong',
  templateUrl: './mahjong.component.html',
  styleUrls: ['./mahjong.component.css']
})
export class MahjongComponent implements OnInit {

  tiles = [
    { type: 'stick', value: 1, class: 's-1', isCorner: true },
    { type: 'stick', value: 2, class: 's-2' },
    { type: 'stick', value: 3, class: 's-3' },
    { type: 'stick', value: 4, class: 's-4' },
    { type: 'stick', value: 5, class: 's-5' },
    { type: 'stick', value: 6, class: 's-6' },
    { type: 'stick', value: 7, class: 's-7' },
    { type: 'stick', value: 8, class: 's-8' },
    { type: 'stick', value: 9, class: 's-9', isCorner: true },
    { type: 'ball', value: 1, class: 'b-1', isCorner: true },
    { type: 'ball', value: 2, class: 'b-2' },
    { type: 'ball', value: 3, class: 'b-3' },
    { type: 'ball', value: 4, class: 'b-4' },
    { type: 'ball', value: 5, class: 'b-5' },
    { type: 'ball', value: 6, class: 'b-6' },
    { type: 'ball', value: 7, class: 'b-7' },
    { type: 'ball', value: 8, class: 'b-8' },
    { type: 'ball', value: 9, class: 'b-9', isCorner: true },
    { type: 'chinese', value: 1, class: 'c-1', isCorner: true },
    { type: 'chinese', value: 2, class: 'c-2' },
    { type: 'chinese', value: 3, class: 'c-3' },
    { type: 'chinese', value: 4, class: 'c-4' },
    { type: 'chinese', value: 5, class: 'c-5' },
    { type: 'chinese', value: 6, class: 'c-6' },
    { type: 'chinese', value: 7, class: 'c-7' },
    { type: 'chinese', value: 8, class: 'c-8' },
    { type: 'chinese', value: 9, class: 'c-9', isCorner: true },
    { type: 'dragon', value: 'G', class: 'd-g', isSpecial: true },
    { type: 'dragon', value: 'R', class: 'd-r', isSpecial: true },
    { type: 'dragon', value: 'W', class: 'd-w', isSpecial: true },
    { type: 'wind', value: 'N', class: 'w-n', isSpecial: true },
    { type: 'wind', value: 'S', class: 'w-s', isSpecial: true },
    { type: 'wind', value: 'E', class: 'w-e', isSpecial: true },
    { type: 'wind', value: 'W', class: 'w-w', isSpecial: true },
  ];

  constructor() { }

  ngOnInit() {
  }

}