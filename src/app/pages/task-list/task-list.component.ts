import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AlertService } from "src/app/alert.service";
import { BackendService, Task, User } from "src/app/backend.service";

@Component({
  selector: "app-task-list",
  templateUrl: "./task-list.component.html"
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  tasksFilter: Task[] = [];
  users: User[] = [];
  taskSelected: Task;
  formTask: FormGroup;
  formSearch: FormGroup;
  destroy$ = new Subject();
  constructor(
    private backend: BackendService,
    private formBuilder: FormBuilder,
    private router: Router,
    private alert: AlertService
  ) {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.initData();
    this.initFormTask();
    this.initFormSearchTask();
  }

  private initData() {
    this.backend
      .tasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        this.tasks = val ?? [];
        this.tasksFilter = val ?? [];
      });
    this.backend
      .users()
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        this.users = val ?? [];
      });
  }

  private initFormTask() {
    this.formTask = this.formBuilder.group({
      id: [
        {
          value: this.taskSelected?.id,
          disabled: true,
        },
      ],
      description: [this.taskSelected?.description, [Validators.required]],
      assigneeId: [this.taskSelected?.assigneeId],
      completed: [this.taskSelected?.completed || false],
    });
  }

  private initFormSearchTask() {
    this.formSearch = this.formBuilder.group({
      id: [""],
      description: [""],
    });
  }

  public onCreateTask() {
    if (this.formTask.valid) {
      const payload = this.formTask.getRawValue();
      this.backend
        .newTask(payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe((val) => {
          this.tasks.push(val);
          this.onSearch();
          this.initFormTask();
          this.alert.show('Create success!');
        });
    }
  }

  public onUpdateTask() {
    if (this.formTask.valid) {
      const payload = this.formTask.getRawValue();
      this.backend
        .update(this.taskSelected?.id, payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe((val) => {
          const find = this.tasks.find((t) => t.id === this.taskSelected.id);
          find.assigneeId = val.assigneeId;
          find.completed = val.completed;
          find.description = val.description;
          this.taskSelected = undefined;
          this.onSearch();
          this.initFormTask();
          this.alert.show('Save success!');
        });
    }
  }

  public onEditTask(param: Task) {
    this.taskSelected = param;
    this.formTask.patchValue(this.taskSelected);
  }

  public onSubmit() {
    this.formTask.markAllAsTouched();
    this.formTask.updateValueAndValidity();
    if (this.taskSelected) {
      this.onUpdateTask();
    } else {
      this.onCreateTask();
    }
  }

  public onCancel() {
    this.taskSelected = undefined;
    this.initFormTask();
  }

  public onDetailTask(param: Task) {
    this.router.navigate(["detail", param.id]);
  }

  public onSearch() {
    const valueSearch = this.formSearch.getRawValue();
    this.tasksFilter = this.tasks.filter(
      (t) =>
        (!valueSearch.id && !valueSearch.description) ||
        (t.id == valueSearch.id && !!t.description) ||
        (!!t.id &&
          t.description
            ?.toUpperCase()
            .includes(valueSearch.description?.toUpperCase())) ||
        (t.id == valueSearch.id &&
          t.description
            ?.toUpperCase()
            .includes(valueSearch.description?.toUpperCase()))
    );
  }

  public onClearSearch() {
    this.tasksFilter = JSON.parse(JSON.stringify(this.tasks));
    this.formSearch.patchValue({
      id: "",
      description: "",
    });
  }

  public hasFilterSearch() {
    const valueSearch = this.formSearch.getRawValue();
    return valueSearch.id || valueSearch.description;
  }

  public hasErrorTaskFormBy(prop: string) {
    const control = this.formTask.get(prop);
    return control.invalid && (control.dirty || control.touched);
  }
}
