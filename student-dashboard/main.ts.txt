import { bootstrapApplication } from '@angular/platform-browser';
import { StudentDashboardComponent } from './student-dashboard.component';

bootstrapApplication(StudentDashboardComponent).catch((err) =>
  console.error(err)
);
