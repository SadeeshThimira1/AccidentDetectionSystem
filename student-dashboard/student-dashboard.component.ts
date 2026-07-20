import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Student {
  id: number;
  name: string;
  email: string;
  course: string;
  grade: string;
  status: 'Active' | 'Inactive';
  enrollmentDate: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard">
      <aside class="sidebar">
        <div class="logo">
          <span class="logo-icon">🎓</span>
          <span class="logo-text">EduManage</span>
        </div>
        <nav class="nav">
          <a class="nav-item active">Dashboard</a>
          <a class="nav-item">Students</a>
          <a class="nav-item">Courses</a>
          <a class="nav-item">Reports</a>
          <a class="nav-item">Settings</a>
        </nav>
      </aside>

      <main class="main">
        <header class="header">
          <div>
            <h1>Student Management</h1>
            <p class="subtitle">Overview of enrolled students and performance</p>
          </div>
          <button class="btn-primary" (click)="openForm()">+ Add Student</button>
        </header>

        <section class="stats">
          <div class="stat-card" *ngFor="let stat of stats">
            <div class="stat-icon" [style.background]="stat.color">{{ stat.icon }}</div>
            <div>
              <p class="stat-value">{{ stat.value }}</p>
              <p class="stat-label">{{ stat.label }}</p>
            </div>
          </div>
        </section>

        <section class="panel">
          <div class="panel-header">
            <h2>All Students</h2>
            <input
              type="text"
              class="search-input"
              placeholder="Search by name, email, or course..."
              [(ngModel)]="searchTerm"
            />
          </div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Grade</th>
                  <th>Status</th>
                  <th>Enrolled</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let student of filteredStudents">
                  <td>#{{ student.id }}</td>
                  <td class="name-cell">{{ student.name }}</td>
                  <td>{{ student.email }}</td>
                  <td><span class="course-badge">{{ student.course }}</span></td>
                  <td><span class="grade" [class.grade-a]="student.grade.startsWith('A')" [class.grade-b]="student.grade.startsWith('B')">{{ student.grade }}</span></td>
                  <td>
                    <span class="status" [class.active]="student.status === 'Active'" [class.inactive]="student.status === 'Inactive'">
                      {{ student.status }}
                    </span>
                  </td>
                  <td>{{ student.enrollmentDate }}</td>
                  <td class="actions">
                    <button class="btn-icon" title="Edit" (click)="editStudent(student)">✏️</button>
                    <button class="btn-icon danger" title="Delete" (click)="deleteStudent(student.id)">🗑️</button>
                  </td>
                </tr>
                <tr *ngIf="filteredStudents.length === 0">
                  <td colspan="8" class="empty">No students found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>

    <div class="overlay" *ngIf="showForm" (click)="closeForm()">
      <div class="modal" (click)="$event.stopPropagation()">
        <h3>{{ editingId ? 'Edit Student' : 'Add New Student' }}</h3>
        <form (ngSubmit)="saveStudent()">
          <label>
            Full Name
            <input type="text" [(ngModel)]="form.name" name="name" required />
          </label>
          <label>
            Email
            <input type="email" [(ngModel)]="form.email" name="email" required />
          </label>
          <label>
            Course
            <select [(ngModel)]="form.course" name="course" required>
              <option value="">Select course</option>
              <option *ngFor="let c of courses" [value]="c">{{ c }}</option>
            </select>
          </label>
          <label>
            Grade
            <select [(ngModel)]="form.grade" name="grade" required>
              <option value="">Select grade</option>
              <option *ngFor="let g of grades" [value]="g">{{ g }}</option>
            </select>
          </label>
          <label>
            Status
            <select [(ngModel)]="form.status" name="status" required>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>
          <div class="modal-actions">
            <button type="button" class="btn-secondary" (click)="closeForm()">Cancel</button>
            <button type="submit" class="btn-primary">{{ editingId ? 'Update' : 'Save' }}</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    * { box-sizing: border-box; margin: 0; padding: 0; }
    :host {
      font-family: 'Inter', system-ui, sans-serif;
      display: block;
      min-height: 100vh;
      background: #f0f2f8;
      color: #1e293b;
    }
    .dashboard { display: flex; min-height: 100vh; }

    .sidebar {
      width: 240px;
      background: linear-gradient(180deg, #1e3a5f 0%, #0f2744 100%);
      color: #fff;
      padding: 24px 16px;
      flex-shrink: 0;
    }
    .logo { display: flex; align-items: center; gap: 10px; padding: 0 12px 32px; }
    .logo-icon { font-size: 28px; }
    .logo-text { font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }
    .nav { display: flex; flex-direction: column; gap: 4px; }
    .nav-item {
      padding: 12px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      color: rgba(255,255,255,0.7);
      transition: all 0.2s;
    }
    .nav-item:hover { background: rgba(255,255,255,0.1); color: #fff; }
    .nav-item.active { background: rgba(255,255,255,0.15); color: #fff; }

    .main { flex: 1; padding: 32px; overflow-x: auto; }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 28px;
      flex-wrap: wrap;
      gap: 16px;
    }
    .header h1 { font-size: 28px; font-weight: 700; color: #0f172a; }
    .subtitle { color: #64748b; font-size: 14px; margin-top: 4px; }

    .btn-primary {
      background: #3b82f6;
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-primary:hover { background: #2563eb; }
    .btn-secondary {
      background: #e2e8f0;
      color: #475569;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-secondary:hover { background: #cbd5e1; }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 28px;
    }
    .stat-card {
      background: #fff;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
    }
    .stat-value { font-size: 26px; font-weight: 700; color: #0f172a; }
    .stat-label { font-size: 13px; color: #64748b; margin-top: 2px; }

    .panel {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      overflow: hidden;
    }
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid #e2e8f0;
      flex-wrap: wrap;
      gap: 12px;
    }
    .panel-header h2 { font-size: 18px; font-weight: 600; }
    .search-input {
      padding: 8px 14px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      width: 280px;
      outline: none;
      transition: border-color 0.2s;
    }
    .search-input:focus { border-color: #3b82f6; }

    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    th {
      text-align: left;
      padding: 12px 16px;
      background: #f8fafc;
      color: #64748b;
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    td { padding: 14px 16px; border-top: 1px solid #f1f5f9; }
    tr:hover td { background: #f8fafc; }
    .name-cell { font-weight: 600; color: #0f172a; }
    .course-badge {
      background: #eff6ff;
      color: #2563eb;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }
    .grade { font-weight: 700; }
    .grade-a { color: #16a34a; }
    .grade-b { color: #ca8a04; }
    .status {
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    .status.active { background: #dcfce7; color: #16a34a; }
    .status.inactive { background: #fee2e2; color: #dc2626; }
    .actions { display: flex; gap: 6px; }
    .btn-icon {
      background: #f1f5f9;
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    }
    .btn-icon:hover { background: #e2e8f0; }
    .btn-icon.danger:hover { background: #fee2e2; }
    .empty { text-align: center; color: #94a3b8; padding: 40px !important; }

    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(15,23,42,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
    }
    .modal {
      background: #fff;
      border-radius: 12px;
      padding: 28px;
      width: 100%;
      max-width: 440px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    }
    .modal h3 { font-size: 20px; font-weight: 700; margin-bottom: 20px; }
    .modal label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: #475569;
      margin-bottom: 14px;
    }
    .modal input, .modal select {
      display: block;
      width: 100%;
      margin-top: 6px;
      padding: 10px 12px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
    }
    .modal input:focus, .modal select:focus { border-color: #3b82f6; }
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 24px;
    }

    @media (max-width: 768px) {
      .sidebar { display: none; }
      .main { padding: 16px; }
      .search-input { width: 100%; }
    }
  `],
})
export class StudentDashboardComponent {
  searchTerm = '';
  showForm = false;
  editingId: number | null = null;

  courses = ['Computer Science', 'Mathematics', 'Physics', 'Biology', 'Business'];
  grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C'];

  form = this.emptyForm();

  students: Student[] = [
    { id: 101, name: 'Alice Johnson', email: 'alice@school.edu', course: 'Computer Science', grade: 'A+', status: 'Active', enrollmentDate: '2024-09-01' },
    { id: 102, name: 'Bob Smith', email: 'bob@school.edu', course: 'Mathematics', grade: 'B+', status: 'Active', enrollmentDate: '2024-09-01' },
    { id: 103, name: 'Carol Williams', email: 'carol@school.edu', course: 'Physics', grade: 'A', status: 'Active', enrollmentDate: '2024-09-15' },
    { id: 104, name: 'David Brown', email: 'david@school.edu', course: 'Biology', grade: 'B', status: 'Inactive', enrollmentDate: '2023-09-01' },
    { id: 105, name: 'Eva Martinez', email: 'eva@school.edu', course: 'Business', grade: 'A-', status: 'Active', enrollmentDate: '2024-09-01' },
    { id: 106, name: 'Frank Lee', email: 'frank@school.edu', course: 'Computer Science', grade: 'C+', status: 'Active', enrollmentDate: '2024-10-01' },
  ];

  get stats() {
    const active = this.students.filter((s) => s.status === 'Active').length;
    const avgGrade = this.students.filter((s) => s.grade.startsWith('A')).length;
    return [
      { icon: '👥', label: 'Total Students', value: this.students.length, color: '#dbeafe' },
      { icon: '✅', label: 'Active', value: active, color: '#dcfce7' },
      { icon: '🏆', label: 'Top Performers', value: avgGrade, color: '#fef9c3' },
      { icon: '📚', label: 'Courses', value: this.courses.length, color: '#f3e8ff' },
    ];
  }

  get filteredStudents(): Student[] {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) return this.students;
    return this.students.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term) ||
        s.course.toLowerCase().includes(term)
    );
  }

  openForm(): void {
    this.form = this.emptyForm();
    this.editingId = null;
    this.showForm = true;
  }

  editStudent(student: Student): void {
    this.form = { ...student };
    this.editingId = student.id;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingId = null;
  }

  saveStudent(): void {
    if (!this.form.name || !this.form.email || !this.form.course || !this.form.grade) return;

    if (this.editingId) {
      const idx = this.students.findIndex((s) => s.id === this.editingId);
      if (idx !== -1) this.students[idx] = { ...this.form, id: this.editingId } as Student;
    } else {
      const newId = Math.max(...this.students.map((s) => s.id), 100) + 1;
      this.students.push({
        ...this.form,
        id: newId,
        enrollmentDate: new Date().toISOString().slice(0, 10),
      } as Student);
    }
    this.closeForm();
  }

  deleteStudent(id: number): void {
    this.students = this.students.filter((s) => s.id !== id);
  }

  private emptyForm() {
    return { name: '', email: '', course: '', grade: '', status: 'Active' as const };
  }
}
