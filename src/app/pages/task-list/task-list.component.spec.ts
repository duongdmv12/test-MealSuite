import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { AlertService } from "src/app/alert.service";
import { BackendService } from "src/app/backend.service";
import { Task } from "src/app/backend.service";
import { TaskListComponent } from "./task-list.component";

describe("TaskListComponent", () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  beforeEach(() => {
    const formBuilderStub = () => ({ group: object => ({}) });
    const routerStub = () => ({ navigate: array => ({}) });
    const alertServiceStub = () => ({ show: string => ({}) });
    const backendServiceStub = () => ({
      tasks: () => ({ pipe: () => ({ subscribe: f => f({}) }) }),
      users: () => ({ pipe: () => ({ subscribe: f => f({}) }) }),
      newTask: payload => ({ pipe: () => ({ subscribe: f => f({}) }) }),
      update: (arg, payload) => ({ pipe: () => ({ subscribe: f => f({}) }) })
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TaskListComponent],
      providers: [
        { provide: FormBuilder, useFactory: formBuilderStub },
        { provide: Router, useFactory: routerStub },
        { provide: AlertService, useFactory: alertServiceStub },
        { provide: BackendService, useFactory: backendServiceStub }
      ]
    });
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`tasks has default value`, () => {
    expect(component.tasks).toEqual([]);
  });

  it(`tasksFilter has default value`, () => {
    expect(component.tasksFilter).toEqual([]);
  });

  it(`users has default value`, () => {
    expect(component.users).toEqual([]);
  });

  describe("onDetailTask", () => {
    it("makes expected calls", () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      const taskStub: Task = <any>{};
      spyOn(routerStub, "navigate").and.callThrough();
      component.onDetailTask(taskStub);
      expect(routerStub.navigate).toHaveBeenCalled();
    });
  });
});
