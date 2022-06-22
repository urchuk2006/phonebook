import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, tap, takeUntil } from 'rxjs';
import { User } from '../user';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit, OnDestroy {

  userIDetails$!: Observable<User>;
  unsubscribe$ = new Subject<void>();
  profileForm!: FormGroup;
  userId!: number;

  constructor(
    private api: ApiService,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.userId = +this.activatedroute.snapshot.params['id'];

    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      phoneNumbers: this.fb.array([], Validators.required),
    });

    this.userIDetails$ = this.api.getUserById(this.userId).pipe(tap(user => {
      this.profileForm.patchValue(user);
      user.phoneNumbers.forEach(number => this.addNumber(number));
    }));

  }

  get phoneNumbers() : FormArray {
    return this.profileForm.get('phoneNumbers') as FormArray
  }

  removeNumber(i: number) {
    this.phoneNumbers.removeAt(i);
  }

  addNumber(number: string = ''):void {
    this.phoneNumbers.push(new FormControl(number));
  }

  onSubmit() {
    let body = {
      name: this.profileForm.controls['name'].value,
      phoneNumbers: this.phoneNumbers.value.filter(Boolean)
    };
    this.api.updateUser(this.userId, body).pipe(
      takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          if (response !== null && response.body) {
            this.snackBar.open(response.body, 'close', {
              duration: 3000,
            });
          }
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.snackBar.open(error.statusText, 'close', {
            duration: 3000,
          });
      }})
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}


