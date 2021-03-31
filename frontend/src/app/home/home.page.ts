import { Component, OnInit } from '@angular/core';
import {Student, StudentService} from "../services/student.service";
import {AlertController, ModalController} from "@ionic/angular";
import {StudentModalPage} from "../student-modal/student-modal.page";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  students: Student[];

  constructor(
    private service: StudentService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.refreshStudentsList();
  }

  removeStudent(id: string) {
    this.alertCtrl.create({
      header: 'Delete',
      message: 'Are you sure you want to delete ?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.service.delete(id).subscribe(response => {
              if (typeof response['success'] != 'undefined') {
                this.students = this.students.filter(student => student.id !== id)
                // this.refreshStudentsList();
              }
            });
          }
        },
        {text: 'Cancel'}
      ]
    }).then(alertElt => alertElt.present());
  }

  private refreshStudentsList() {
    this.service.getAll().subscribe(response => {
      this.students = response;
    });
  }

  openStudentForm() {
    this.modalCtrl.create({
      component: StudentModalPage
    }).then(modal => {
      modal.present();
      return modal.onDidDismiss();
    }).then(({data, role}) => {
      if (role == 'created') {
        this.students.push(data.data)
      }
    });
  }

  updateStudent(newStudent: Student) {
    this.modalCtrl.create({
      component: StudentModalPage,
      componentProps: {student: newStudent}
    }).then(modal => {
      modal.present();
      return modal.onDidDismiss();
    }).then(({data, role}) => {
      if (role == 'updated') {
        this.students = this.students.filter(student => {
          if (student.id === data.data.id) {
            return data.data;
          }

          return student;
        })
      }
    });
  }
}
