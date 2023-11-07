import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subject } from "rxjs";
import { switchMap, takeUntil } from "rxjs/operators";
import { AlertService } from "src/app/alert.service";
import { BackendService, Task, User } from "src/app/backend.service";

@Component({
  selector: "app-task-detail",
  templateUrl: "./task-detail.component.html",
})
export class TaskDetailComponent implements OnInit, OnDestroy {
  taskDetail: Task;
  users: User[] = [];
  destroy$ = new Subject();
  formTask: FormGroup;
  constructor(
    private backendService: BackendService,
    private activeRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private alert: AlertService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.getDataInfo();
  }

  private loadUsers() {
    this.backendService
      .users()
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        this.users = val ?? [];
      });
  }

  private getDataInfo() {
    this.activeRoute.paramMap
      .pipe(
        switchMap((params: ParamMap) =>
          this.backendService.task(+params.get("id")!)
        )
      )
      .subscribe((val) => {
        this.taskDetail = val;
        this.initFormTask();
        this.loadUsers();
      });
  }

  private initFormTask() {
    this.formTask = this.formBuilder.group({
      id: [
        {
          value: this.taskDetail?.id,
          disabled: true,
        },
      ],
      description: [this.taskDetail?.description, [Validators.required]],
      assigneeId: [this.taskDetail?.assigneeId],
      completed: [this.taskDetail?.completed || false],
    });
  }

  public onUpdateTask() {
    if (this.formTask.valid) {
      const payload = this.formTask.getRawValue();
      this.backendService
        .update(this.taskDetail?.id, payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe((val) => {
          this.taskDetail.assigneeId = val.assigneeId;
          this.taskDetail.completed = val.completed;
          this.taskDetail.description = val.description;
          this.initFormTask();
          this.alert.show("Save success!");
        });
    }
  }

  public hasErrorTaskFormBy(prop: string) {
    const control = this.formTask.get(prop);
    return control.invalid && (control.dirty || control.touched);
  }
}
