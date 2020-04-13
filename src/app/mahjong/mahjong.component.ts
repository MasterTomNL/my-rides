import { Component, OnInit } from '@angular/core';
import Tiles from './mahjong_tiles.json';

@Component({
  selector: 'app-mahjong',
  templateUrl: './mahjong.component.html',
  styleUrls: ['./mahjong.component.css']
})
export class MahjongComponent implements OnInit {
  tiles = Tiles;

  constructor() { }

  ngOnInit() {
  }

}