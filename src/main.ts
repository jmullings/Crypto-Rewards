import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

class CryptoEpochRewards {
  calculateRewardPeso(
    stakedAmountPeso: number,
    stakeDuration: { start: Date; finish: Date },
    profitShareAmount: number,
    marketCapAmount: number
  ): number {
    if (stakedAmountPeso <= 0) {
      return 0;
    }

    if (profitShareAmount <= 0) {
      return 0;
    }

    if (marketCapAmount <= 0) {
      return 0;
    }

    const stakeStartTime = stakeDuration.start.getTime();
    const stakeFinishTime = stakeDuration.finish.getTime();

    if (stakeStartTime >= stakeFinishTime) {
      return 0;
    }

    const stakeDurationDays = (stakeFinishTime - stakeStartTime) / (1000 * 60 * 60 * 24);
    if (stakeDurationDays <= 0) {
      return 0;
    }

    const rewardRatePeso = profitShareAmount / marketCapAmount;
    const rewardAmountPeso = (stakedAmountPeso * rewardRatePeso * stakeDurationDays);

    return rewardAmountPeso;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="container">
      <h1>Crypto Rewards Calculator (PHP)</h1>

      <div class="result">
        <h2>Calculated Reward: {{ formatReward(calculatedReward) }} PHP</h2>
      </div>

      <div class="form">
        <div class="form-group">
          <label for="stakedAmount">Staked Amount (PHP):</label>
          <input
            type="number"
            id="stakedAmount"
            [(ngModel)]="stakedAmount"
            (ngModelChange)="calculateReward()"
            placeholder="Enter amount in PHP"
          >
        </div>

        <div class="form-group">
          <label for="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            [(ngModel)]="startDate"
            (ngModelChange)="calculateReward()"
          >
        </div>

        <div class="form-group">
          <label for="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            [(ngModel)]="endDate"
            (ngModelChange)="calculateReward()"
          >
        </div>

        <div class="form-group">
          <label for="profitShare">Profit Share Amount (PHP):</label>
          <input
            type="number"
            id="profitShare"
            [(ngModel)]="profitShare"
            (ngModelChange)="calculateReward()"
            placeholder="Enter amount in PHP"
          >
        </div>

        <div class="form-group">
          <label for="marketCap">Market Cap (PHP):</label>
          <input
            type="number"
            id="marketCap"
            [(ngModel)]="marketCap"
            (ngModelChange)="calculateReward()"
            placeholder="Enter amount in PHP"
          >
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      font-family: Arial, sans-serif;
    }

    .result {
      background-color: #f0f0f0;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      text-align: center;
    }

    .result h2 {
      margin: 0;
      color: #333;
    }

    .form {
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .form-group {
      margin-bottom: 15px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }

    input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }

    input:focus {
      outline: none;
      border-color: #007bff;
    }
  `]
})
export class App {
  private calculator = new CryptoEpochRewards();

  stakedAmount: number = 10000;
  startDate: string = new Date().toISOString().split('T')[0];
  endDate: string = new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0];
  profitShare: number = 101591068;
  marketCap: number = 3753480698;
  calculatedReward: number = 0;

  ngOnInit() {
    this.calculateReward();
  }

  calculateReward() {
    this.calculatedReward = this.calculator.calculateRewardPeso(
      this.stakedAmount,
      {
        start: new Date(this.startDate),
        finish: new Date(this.endDate)
      },
      this.profitShare,
      this.marketCap
    );
  }

  formatReward(reward: number): string {
    return reward.toFixed(2);
  }
}

bootstrapApplication(App);