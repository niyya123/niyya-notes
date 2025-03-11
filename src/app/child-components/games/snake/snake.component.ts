import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.scss']
})
export class SnakeComponent implements OnInit, AfterViewInit {
  constructor( private nznoti:NzNotificationService){

  }
  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
  }

  @ViewChild('gameCanvas') canvas!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private snake: { x: number; y: number }[] = [{ x: 200, y: 200 }];
  private food = { x: 0, y: 0 };
  private direction = { x: 1, y: 0 }; // Start moving right by default
  private gameInterval: any;
  private tileSize = 20;

  score = 0;

  ngOnInit() {
    this.placeFood();
  }

  startGame() {
    if (this.gameInterval) return;
  
    this.resetGame(); // Reset game before starting
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    document.addEventListener('keydown', (e) => this.changeDirection(e));
  
    this.gameInterval = setInterval(() => {
      this.updateGame();
    }, 100);
  }

  resetGame() {
    clearInterval(this.gameInterval);
    this.gameInterval = null;
    this.snake = [{ x: 200, y: 200 }]; // Reset snake to starting position
    this.direction = { x: 1, y: 0 }; // Default direction to moving right
    this.score = 0;
    this.placeFood();
    this.clearCanvas();
  }

  updateGame() {
    const head = {
      x: this.snake[0].x + this.direction.x * this.tileSize,
      y: this.snake[0].y + this.direction.y * this.tileSize,
    };

    if (this.isCollision(head)) {
      this.nznoti.info('Opps','You failed!!')
      this.resetGame();
      return;
    }

    this.snake.unshift(head);

    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      this.placeFood();
    } else {
      this.snake.pop();
    }

    this.clearCanvas();
    this.drawFood();
    this.drawSnake();
  }

  clearCanvas() {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, 500, 500);
  }

  drawSnake() {
    this.ctx.fillStyle = 'green';
    this.snake.forEach((segment) => {
      this.drawRoundedTile(segment.x, segment.y, this.tileSize, this.tileSize, 10);
    });
  }

  drawFood() {
    this.ctx.fillStyle = 'red';
    this.ctx.beginPath();
    this.ctx.arc(
      this.food.x + this.tileSize / 2,
      this.food.y + this.tileSize / 2,
      this.tileSize / 2,
      0,
      2 * Math.PI
    );
    this.ctx.fill();
  }

  drawRoundedTile(x: number, y: number, width: number, height: number, radius: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.arcTo(x + width, y, x + width, y + height, radius);
    this.ctx.arcTo(x + width, y + height, x, y + height, radius);
    this.ctx.arcTo(x, y + height, x, y, radius);
    this.ctx.arcTo(x, y, x + width, y, radius);
    this.ctx.closePath();
    this.ctx.fill();
  }

  changeDirection(event: KeyboardEvent) {
    const { key } = event;
  
    if (key === 'ArrowUp' && this.direction.y === 0) {
      this.direction = { x: 0, y: -1 };
    } else if (key === 'ArrowDown' && this.direction.y === 0) {
      this.direction = { x: 0, y: 1 };
    } else if (key === 'ArrowLeft' && this.direction.x === 0) {
      this.direction = { x: -1, y: 0 };
    } else if (key === 'ArrowRight' && this.direction.x === 0) {
      this.direction = { x: 1, y: 0 };
    }
  }

  isCollision(head: { x: number; y: number }): boolean {
    // Check collision with walls
    if (head.x < 0 || head.y < 0 || head.x >= 500 || head.y >= 500) {
      return true;
    }
  
    // Check collision with itself (ignore the head at index 0)
    return this.snake.some(
      (segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y
    );
  }

  placeFood() {
    do {
      this.food = {
        x: Math.floor(Math.random() * (500 / this.tileSize)) * this.tileSize,
        y: Math.floor(Math.random() * (500 / this.tileSize)) * this.tileSize,
      };
    } while (this.snake.some(segment => segment.x === this.food.x && segment.y === this.food.y));
  }

}
