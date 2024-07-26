import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DiceComponent } from '../../child-components/games/dice/dice.component';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './games.component.html',
  styleUrl: './games.component.scss'
})
export class GamesComponent implements OnInit {

  showGames:any

  constructor(    private router : Router){

  }
  ngOnInit(): void {
  }
  toGames(string:any){
    if(string == 'dice'){
      this.router.navigate(['/home/games',string])
    }
  }

}
