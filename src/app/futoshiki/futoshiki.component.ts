import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-futoshiki',
  templateUrl: './futoshiki.component.html',
  styleUrls: ['./futoshiki.component.css']
})
export class FutoshikiComponent implements OnInit {
  challenge;
  cells;
  arrow_lib = {
    'd': 'arrow_drop_down',
    'u': 'arrow_drop_up',
    'r': 'arrow_right',
    'l': 'arrow_left',
  };

  challenges = [
    {
      'name': 'Not as hard',
      'cells': [
        ['','','',''],
        ['','','',''],
        ['','','',''],
        ['','','',''],
      ],
      'disabled': [
        [,,,],
        [,,,],
        [,,,],
        [,,,],
      ],
      'arrows': [
        [,,,],
        [,'r','r',],
        ['u','r','r',],
        [,,'r',],
      ]
    },
    {
      'name': 'Supposedly hard...',
      'cells': [
        [3,0,0,0],
        [0,0,0,0],
        [0,1,0,0],
        [0,0,0,0],
      ],
      'disabled': [
        [true,,,],
        [,,,],
        [,true,,],
        [,,,],
      ],
      'arrows': [
        [,,,],
        [,'u',,'l'],
        ['u',,'l','u'],
        [,,,],
      ]
    }
  ];

  constructor() { }

  ngOnInit() {
    this.challenge = this.challenges[1];
  }

  add(r, c) {
    let val = this.challenge.cells[r][c];
    if (val == ' ')
      val = 1;
    else
      val += 1;
    if (val > 4)
      val = 1;
    this.challenge.cells[r][c] = val;
  }

  valid(r, c) {
    if (!this.challenge)
      return '';
    const row = this.challenge.cells[r];
    const val = row[c];
    if (val == 0)
      return 'muted';

    if (row.filter(x => x == row[c]).length > 1) {
      return 'warn';
    }

    let count = 0;
    this.challenge.cells.forEach(function(r) {
      if (r[c] == row[c])
        count++;
    });
    if (count > 1)
      return 'warn';
    return '';
  }
}