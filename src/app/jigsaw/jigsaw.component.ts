import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-jigsaw',
  templateUrl: './jigsaw.component.html',
  styleUrls: ['./jigsaw.component.css']
})
export class JigsawComponent implements OnInit {

  grid = { 'rows': 3, 'cols': 3 }; 

  pieces = [
    { 'shape': 'line', 'contents': ['r', 't'], 'cols': 1, 'rows': 2 },
    { 'shape': 'bar', 'contents': ['e', 'f'], 'cols': 2, 'rows': 1 },
    { 'shape': 'bar', 'contents': ['y', 'z'], 'cols': 2, 'rows': 1 },
  ];

  colors = [ 'lightgrey', 'white' ];
  randomColors = [];

  constructor() { }

  ngOnInit() {
    this.drawGrid();
    this.drawShapes();
  }

  drawGrid() {

  }

  drawShapes() {

  }

  makeArray(length) {
    return new Array(length);
  }

  alternateColor(index) {
    return this.colors[index % 2];
  }

  randomColor(i) {
    if (!this.randomColors[i]) {
      const r = Math.random() * 100;
      const g = Math.random() * 100;
      const b = Math.random() * 100;
      this.randomColors[i] = 'rgb(' + r + ',' + g + ',' + b + ')';
    }
    return this.randomColors[i];
  }

}