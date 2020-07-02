import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-model-boxer',
  templateUrl: './model-boxer.component.html',
  styleUrls: ['./model-boxer.component.css']
})
export class ModelBoxerComponent implements OnInit {

  constructor() {
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
    camera.position.set( 0, 0, 100 );
    camera.lookAt( 0, 0, 0 );

    const scene = new THREE.Scene();
  }

  ngOnInit() {
  }

}