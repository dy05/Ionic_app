import {Component, Input, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {ModalController} from "@ionic/angular";
import {Student, StudentService} from "../services/student.service";

@Component({
  selector: 'app-student-modal',
  templateUrl: './student-modal.page.html',
  styleUrls: ['./student-modal.page.scss'],
})
export class StudentModalPage implements OnInit {
  @Input() student: Student;
  editing = false;
  data = {
    name: '',
    email: '',
    password: '',
  }

  constructor(
    private service: StudentService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    if (this.student) {
      this.editing = true;
      this.data =  this.student;
    }
  }

  onSubmit(form: NgForm) {
    const student = form.value
    if (student.name.trim().length > 0
      && student.email.trim().length > 0
    ) {
      if (this.editing) {
        this.service.update(this.student.id, student).subscribe(response => {
          if (response['success']) {
            student.id = this.student.id;
            this.modalCtrl.dismiss(student, 'updated');
          }
        });
      } else if (student.password.trim().length > 0) {
        this.service.create(student).subscribe(response => {
          if (response['success']) {
            this.modalCtrl.dismiss(response, 'created');
          }
        });
      } else {
        console.log('error error, emty password')
      }
    }
  }

  onClose() {
    this.modalCtrl.dismiss(null, 'closed');
  }
}
