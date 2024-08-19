import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CRUDexpenses {

  constructor(
    private firestore: AngularFirestore,
    private router: Router
  ) { }

    // ฟังก์ชันดึงข้อมูลจาก Firestore ตามวันที่
    getDocument(collection: string, currentDate: string): Observable<any[]> {
      return this.firestore.collection(collection).valueChanges({ idField: 'id' }).pipe(
        map((items: any[]) => {
          return items.filter(item => {
            return item.date === currentDate; // เปรียบเทียบ date โดยตรงที่เป็น string
          });
        })
      );
    }
  
    // ฟังก์ชันเพิ่มข้อมูล
    addDocument(data: any): Promise<void> {
      const id = this.firestore.createId();
      
      // แปลง amount ให้เป็น number
      const amountAsNumber = parseFloat(data.amount);
      
      // เพิ่มรายการใน expenses collection
      return this.firestore.collection("expenses").doc(id).set({
        ...data,
        amount: amountAsNumber,
        date: data.date // ใช้ date ที่เป็น string โดยตรง
      });
    }
  
    // ฟังก์ชันอัปเดตข้อมูล
    updateDocument(id: string, data: any): Promise<void> {
      return this.firestore.collection("expenses").doc(id).update({
        ...data,
        date: data.date // ใช้ date ที่เป็น string โดยตรง
      });
    }

  // ลบเอกสาร
  deleteDocument(id: string): Promise<void> {
    return this.firestore.collection("expenses").doc(id).delete();
  }

  // ส่งข้อมูลที่จัดกลุ่มไปยังหน้า home01
  goToHome(groupedItems: any) {
    this.router.navigate(['/home01'], { state: { groupedItems: groupedItems } });
  }
}
