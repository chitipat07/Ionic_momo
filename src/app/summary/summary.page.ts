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
  displayMode: string = 'daily'; // 'daily' or 'monthly'

  constructor(private firestore: AngularFirestore) {}

  ngOnInit() {
    this.loadExpenses();
  }

  loadExpenses() {
    this.firestore.collection("expenses").valueChanges().subscribe((data: any) => {
      let groupedData: { [key: string]: number } | undefined;
  
      if (this.displayMode === 'daily') {
        groupedData = this.groupByDate(data);
      } else if (this.displayMode === 'monthly') {
        groupedData = this.groupByMonth(data);
      }
  
      if (groupedData && Object.keys(groupedData).length > 0) {
        const labels = Object.keys(groupedData); // ไม่ใช้ sort()
        const amounts = Object.values(groupedData);
  
        this.createBarChart(labels, amounts);
      } else {
        console.error("No data to display or groupedData is undefined.");
      }
    });
  }
  
  

  groupByDate(data: any[]): { [key: string]: number } {
    return data.reduce((acc, curr) => {
      const date = curr.date;  // ใช้ date ที่เป็น string ในรูปแบบ YYYY-MM-DD
      const amount = Number(curr.amount);

      if (!acc[date]) {
        acc[date] = 0;
      }

      acc[date] += amount;
      return acc;
    }, {} as { [key: string]: number });
  }

  groupByMonth(data: any[]): { [key: string]: number } {
    return data.reduce((acc, curr) => {
      const month = curr.date.substring(0, 7);  // ดึงเฉพาะส่วน YYYY-MM จาก date
      const amount = Number(curr.amount);

      if (!acc[month]) {
        acc[month] = 0;
      }

      acc[month] += amount;
      return acc;
    }, {} as { [key: string]: number });
  }

  createBarChart(labels: string[], data: number[]) {
    if (this.chart && typeof this.chart.destroy === 'function') {
      this.chart.destroy(); // ลบ chart เก่าออกก่อนสร้างใหม่
    }

    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: this.displayMode === 'daily' ? 'Total Daily Expenses' : 'Total Monthly Expenses',
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

  // ฟังก์ชันที่เรียกเมื่อผู้ใช้เปลี่ยนโหมดการแสดงผล
  changeDisplayMode(mode: string) {
    this.displayMode = mode;
    this.loadExpenses();  // โหลดข้อมูลใหม่ตามโหมดที่เลือก
  }
}
