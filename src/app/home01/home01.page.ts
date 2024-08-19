import { Component, OnInit } from '@angular/core';
import { CRUDexpenses } from './CRUDexpenses.page';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Timestamp } from 'firebase/firestore'; 


@Component({
  selector: 'app-home01',
  templateUrl: './home01.page.html',
  styleUrls: ['./home01.page.scss'],
})
export class Home01Page implements OnInit {

  items: any[] = [];
  currentDate: string | undefined;

  constructor(private crudExpenses: CRUDexpenses, 
              private router: Router,
              private alertController: AlertController,) { }

 ngOnInit() {
    // ตั้งค่าวันที่ปัจจุบัน
    this.setCurrentDate();

    // ดึงข้อมูลจาก Firestore โดยกรองเฉพาะข้อมูลที่มี date ตรงกับวันที่ปัจจุบัน
    if (this.currentDate) {
      this.crudExpenses.getDocument('expenses', this.currentDate).subscribe((data) => {
        this.items = data;
        console.log(this.items);
      });
    }
  }

  // ฟังก์ชันเพื่อแปลงวันที่ปัจจุบันเป็นรูปแบบ YYYY-MM-DD
  setCurrentDate() {
    const now = new Date();
    this.currentDate = now.toISOString().substring(0, 10); // ใช้รูปแบบ YYYY-MM-DD
  }

  async alertAddForm() {
    const alert = await this.alertController.create({
      header: 'เพิ่มรายการใช้จ่าย',
      subHeader: 'Enter your information',
      inputs: [
        {
          name: 'category',
          type: 'text',
          placeholder: 'ใส่รายการ'
        },
        {
          name: 'amount',
          type: 'number',
          placeholder: 'จ่ายไป'
        },
        {
          name: 'date',
          type: 'date',
          placeholder: 'วันที่'
        },
        {
          name: 'note',
          type: 'text',
          placeholder: 'หมายเหตุ'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'ADD',
          handler: (data) => {
            const formData = {
              ...data,
              date: data.date ? data.date : new Date().toISOString().substring(0, 10) // ใช้ date ในรูปแบบ string
            };

            this.crudExpenses.addDocument(formData);
            console.log("save", formData);
          }
        }
      ]
    });

    await alert.present();
  }

  // ฟังก์ชันสร้างฟอร์มสำหรับแก้ไขข้อมูล
  async alertEditForm(tmpid: string, tmpdata: any) {

    const alert = await this.alertController.create({
      header: 'แก้ไขรายการ',
      subHeader: 'แก้ไขข้อมูลที่ต้องการ',
      inputs: [
        {
          name: 'category',
          type: 'text',
          placeholder: 'ใส่รายการ',
          value: tmpdata.category
        },
        {
          name: 'amount',
          type: 'number',
          placeholder: 'จ่ายไป',
          value: tmpdata.amount
        },
        {
          name: 'date',
          type: 'date',
          placeholder: 'วันที่',
          value: tmpdata.date // ใช้ string ที่มีรูปแบบ YYYY-MM-DD
        },
        {
          name: 'note',
          type: 'text',
          placeholder: 'หมายเหตุ',
          value: tmpdata.note
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Update',
          handler: (data) => {
            const updatedData = {
              ...data,
              date: data.date ? data.date : tmpdata.date // ใช้ date จากฟอร์มหรือวันที่เดิมหากไม่มีการเปลี่ยนแปลง
            };

            this.crudExpenses.updateDocument(tmpid, updatedData)
              .then(() => {
                console.log("ข้อมูลถูกอัปเดต", updatedData);
              })
              .catch((error) => {
                console.error("การอัปเดตเกิดข้อผิดพลาด", error);
              });
          }
        }
      ]
    });

    await alert.present();
  }

async deleteItem(tmpid: string) {
  const alert = await this.alertController.create({
    header: 'Confirm Delete',
    message: 'Are you sure you want to delete this item?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Delete canceled');
        }
      },
      {
        text: 'Delete',
        handler: () => {
          // Call the delete method in your service
          this.crudExpenses.deleteDocument(tmpid);
          console.log('Deleted item with id:', tmpid);
        }
      }
    ]
  });

  await alert.present();
}
  
  
}

