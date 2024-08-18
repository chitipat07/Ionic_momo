import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage implements OnInit {

  chart: any = [];

  constructor(private firestore: AngularFirestore) {}

  ngOnInit() {
    this.loadExpenses();
  }

  loadExpenses() {
    this.firestore.collection("expenses").valueChanges().subscribe((data: any) => {
      const groupedData = this.groupByDate(data);

      const labels = Object.keys(groupedData);
      const amounts = Object.values(groupedData);

      this.createBarChart(labels, amounts);
    });
  }

  groupByDate(data: any[]): { [key: string]: number } {
    return data.reduce((acc, curr) => {
      const date = new Date(curr.date.seconds * 1000).toLocaleDateString('en-CA');  // Format date as YYYY-MM-DD
      const amount = Number(curr.amount);

      if (!acc[date]) {
        acc[date] = 0;
      }

      acc[date] += amount;
      return acc;
    }, {});
  }

  createBarChart(labels: string[], data: number[]) {
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Total Expenses',
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
