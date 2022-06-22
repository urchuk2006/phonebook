import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  profileForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddUserComponent>
    ) { }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      phoneNumbers: this.fb.array([''], Validators.required),
    });
  }

  get phoneNumbers() : FormArray {
    return this.profileForm.get('phoneNumbers') as FormArray
  }

  addNumber() {
    this.phoneNumbers.push(new FormControl(''));
  }

  removeNumber(i: number) {
    this.phoneNumbers.removeAt(i);
  }

  onSubmit() {
    this.dialogRef.close({
      name: this.profileForm.controls['name'].value,
      phoneNumbers: this.phoneNumbers.value.filter(Boolean)
    });
  }

}
