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

  getDocument(collection: string, currentDate: string): Observable<any[]> {
    return this.firestore.collection(collection).valueChanges({idField: 'id'}).pipe(
      map((items: any[]) => {
        return items.filter(item => {
          const itemDate = item.date.toDate(); // แปลง timestamp เป็น Date
          const formattedDate = itemDate.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' });
          return formattedDate === currentDate;
        });
      })
    );
  }

  addDocument(data: any): Promise<void> {
    const id = this.firestore.createId();
    const expenseDate = new Date(data.date); // แปลงวันที่ที่ได้รับจากฟอร์ม
  
    // แปลง amount ให้เป็น number
    const amountAsNumber = parseFloat(data.amount);
  
    // เพิ่มรายการใน expenses collection
    return this.firestore.collection("expenses").doc(id).set({
      ...data,
      amount: amountAsNumber
    });
  }
  

  // อัปเดตเอกสาร
  updateDocument(id: string, data: any): Promise<void> {
    return this.firestore.collection("expenses").doc(id).update(data);
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
