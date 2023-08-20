import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pomodoro',
  templateUrl: './pomodoro.component.html',
  styleUrls: ['./pomodoro.component.css']
})
export class PomodoroComponent implements OnInit {
  selectedButton: number = 0; // 0: None, 1: Pomodoro, 2: 5 Min Break, 3: 15 Min Break
  minutes: number = 0;
  seconds: number = 0;
  timerInterval: any; // Store the interval ID for the timer
  isPaused: boolean = true; // Initialize as paused
  isPomodoro: boolean = false; // Indicate if the timer is a Pomodoro

  constructor() { }

  ngOnInit(): void {
  }

  selectButton(buttonNumber: number): void {
    this.selectedButton = buttonNumber;
    this.resetTimer();
    this.startTimer();
  }

  startTimer(): void {
    if (this.selectedButton === 0) {
      return;
    }

    this.isPaused = false;
    this.isPomodoro = this.selectedButton === 1;

    // Set timer duration based on selected button
    if (this.isPomodoro) {
      this.minutes = 25;
    } else if (this.selectedButton === 2) {
      this.minutes = 1;
    } else if (this.selectedButton === 3) {
      this.minutes = 15;
    }

    this.seconds = 0;

    this.timerInterval = setInterval(() => {
      if (this.isPaused) {
        return; // Do not update timer if paused
      }

      if (this.minutes === 0 && this.seconds === 0) {
        this.playSound(); // Call a function to play sound
        this.resetTimer();
        clearInterval(this.timerInterval);
      } else if (this.seconds === 0) {
        this.minutes--;
        this.seconds = 59;
      } else {
        this.seconds--;
      }
    }, 1000);
  }

  resetTimer(): void {
    this.minutes = 0;
    this.seconds = 0;
    clearInterval(this.timerInterval);
    this.isPaused = true;
    this.isPomodoro = false;
  }

  formatTime(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  toggleTimer(): void {
    this.isPaused = !this.isPaused;
  }

  getButtonLabel(): string {
    return this.isPaused ? 'Start' : 'Pause';
  }

  playSound(): void {
    const audio = new Audio(); // Create a new audio element
    audio.src = 'assets/Audio/timer.mp3'; // Update with the correct path to your sound file
    audio.load();
    audio.play();
  }
}
