import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../services/api.service';
import { User } from '../user';
import {merge, of as observableOf, Subject} from 'rxjs';
import { catchError, map, startWith, switchMap, takeUntil, debounceTime, tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MatRow } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AddUserComponent } from './add-user.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['id', 'name', 'actions'];
  data: User[] = [];
  resultsLength = 0;
  isLoadingResults = true;
  search: FormControl = new FormControl('');
  unsubscribe$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private api: ApiService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    ) { }

  ngOnInit(): void {
    this.search.valueChanges.pipe(
      debounceTime(100),
      takeUntil(this.unsubscribe$),
      switchMap((text: string) => {
        this.paginator.pageIndex = 0;
        return this.api.getUsers(
          this.sort.direction,
          0,
          this.paginator.pageSize,
          text
        );
      }),
      tap(data => {
        (this.search.value === '') ? this.resultsLength = data.length : this.resultsLength = data.users.length;
      }),
      map(data => {
        if (data === null) {
          return [];
        }
        return data.users;
      }))
      .subscribe(data => (this.data = data));
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.pipe(takeUntil(this.unsubscribe$)).subscribe(() => (this.paginator.pageIndex = 0));
    this.getData();
  }

  getData(): void {
    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        return this.api.getUsers(
          this.sort.direction,
          this.paginator.pageIndex,
          this.paginator.pageSize,
          this.search.value
        ).pipe(catchError(() => observableOf(null)));
      }),
      map(data => {
        // Flip flag to show that loading has finished.
        this.isLoadingResults = false;
        if (data === null) {
          return [];
        }
       (this.search.value === '')? this.resultsLength = data.length : this.resultsLength = data.users.length;
        return data.users;
      }),
      takeUntil(this.unsubscribe$)
    )
    .subscribe(data => (this.data = data));
  }

  openDetails(row: MatRow): void {
    console.log(row);
  }

  deleteUser(id: number): void {
    this.api.deleteUser(id).pipe(takeUntil(this.unsubscribe$))
    .subscribe(response => {
      if (response.body !== null) {
        this.getData();
        this.snackBar.open(response.body, 'close', {
          duration: 3000,
        });
      }
    })
  }

  addUser(): void {
    const dialogRef = this.dialog.open(AddUserComponent);

    dialogRef.afterClosed().pipe(
      takeUntil(this.unsubscribe$),
      switchMap(result => {
        return (result) ? this.api.addUser(result) : observableOf(null)
      })
    ).subscribe(response => {
      if (response !== null && response.body) {
        this.getData();
        this.snackBar.open(response.body, 'close', {
          duration: 3000,
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
