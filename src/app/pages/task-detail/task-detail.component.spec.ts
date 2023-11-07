import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AlertService } from "src/app/alert.service";
import { BackendService } from "src/app/backend.service";
import { RouterTestingModule } from "@angular/router/testing";
import { TaskDetailComponent } from "./task-detail.component";

describe("TaskDetailComponent", () => {
  let component: TaskDetailComponent;
  let fixture: ComponentFixture<TaskDetailComponent>;

  beforeEach(() => {
    const formBuilderStub = () => ({ group: object => ({}) });
    const activatedRouteStub = () => ({
      paramMap: { pipe: () => ({ subscribe: f => f({}) }) }
    });
    const alertServiceStub = () => ({ show: string => ({}) });
    const backendServiceStub = () => ({
      users: () => ({ pipe: () => ({ subscribe: f => f({}) }) }),
      task: arg => ({}),
      update: (arg, payload) => ({ pipe: () => ({ subscribe: f => f({}) }) })
    });
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TaskDetailComponent],
      providers: [
        { provide: FormBuilder, useFactory: formBuilderStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: AlertService, useFactory: alertServiceStub },
        { provide: BackendService, useFactory: backendServiceStub }
      ]
    });
    fixture = TestBed.createComponent(TaskDetailComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`users has default value`, () => {
    expect(component.users).toEqual([]);
  });
});
