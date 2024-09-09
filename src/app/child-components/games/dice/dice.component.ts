import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import moment from 'moment';

@Component({
  selector: 'app-dice',
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.scss'],
  standalone: true,
  imports: [
    NzButtonModule,
    RouterModule,
    CommonModule,
    NzRadioModule,
    FormsModule,
    NzIconModule,
    NzInputModule,
    NzInputNumberModule,
    NgxDaterangepickerMd
  ],
  animations: [
    trigger('roll', [
      state('start', style({ transform: 'rotate(0deg)' })),
      state('end', style({ transform: 'rotate(360deg)' })),
      transition('start => end', animate('0.2s ease-in')),
      transition('end => start', animate('0.2s ease-out'))
    ])
  ]
})
export class DiceComponent implements OnInit {
  radioValue = ''
  lost : any
  money = 4000
  bet : number

  houseNumber: number | null = null;

  diceResult: number | null = 0;
  diceResult2: number | null = 0;

  totalCount : any
  rolling: boolean = false;
  rollState: string = 'start';
  rollDuration: number = 2000;

  history = []

  selected: { startDate: moment.Moment, endDate: moment.Moment };

  constructor( private router : Router,
    private noti : NzNotificationService) { 
    }

  ngOnInit() {
    this.houseNumber = Math.floor(Math.random() * (11 - 2 + 1)) + 2;
  //   const now = moment();
  //   console.log('now: ', now);
  // const end = moment().add(30, 'minutes');
  // console.log('end: ', end);

  // this.selected = {
  //   startDate: now,
  //   endDate: end
  // };
  }

  returnGamesPage($event:any){
    this.router.navigate(['/home/games']);
  }

  rollDice() {
    if(this.radioValue == ''){
      this.noti.error('Error', 'Please select greater or less than')
      return
    }
    if(this.bet == null){
      this.noti.error('Error', 'Please set your bet')
      return
    }
    if(this.money == 0){
      this.noti.error('Error', 'No money left')
      return
    }
    this.lost = null
    this.totalCount = null;
    this.rolling = true;
    this.rollState = 'end';

    const diceRollInterval = setInterval(() => {
      this.diceResult = Math.floor(Math.random() * 6) + 1;
      this.diceResult2 = Math.floor(Math.random() * 6) + 1;
    }, 100); // Update result every 100ms


    setTimeout(() => {
      clearInterval(diceRollInterval); // Stop updating dice result
      this.diceResult = Math.floor(Math.random() * 6) + 1; // Final dice result
      this.diceResult2 = Math.floor(Math.random() * 6) + 1; // Final dice result
      this.totalCount = this.diceResult + this.diceResult2;
      this.history.push(this.totalCount);
      this.rolling = false;
      if(this.radioValue == 'A'){
        if( this.totalCount < this.houseNumber){
          this.lost = false
          this.money = this.money + this.bet
        }else{
          this.lost = true
          this.money = this.money - this.bet
        }
      }
      if(this.radioValue == 'B'){
        if( this.totalCount == this.houseNumber){
          this.lost = false
          this.money = this.money + this.bet
        }else{
          this.lost = true
          this.money = this.money - this.bet
        }
      }
      if(this.radioValue == 'C'){
        if( this.totalCount > this.houseNumber){
          this.lost = false
          this.money = this.money + this.bet
        }else{
          this.lost = true
          this.money = this.money - this.bet
        }
      }
      this.radioValue = ''
      this.bet = null
      this.houseNumber = Math.floor(Math.random() * (11 - 2 + 1)) + 2;
      this.rollState = 'start';
    }, this.rollDuration); 
  }

  clearHistory(){
    this.history = [];
  }

}
