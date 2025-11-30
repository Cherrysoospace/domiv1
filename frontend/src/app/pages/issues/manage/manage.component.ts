import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IssuesService } from 'src/app/services/issue/issues.service';
import { MotorcyclesService } from 'src/app/services/motorcycle/motorcycles.service';
import { Issue } from 'src/app/models/issue/issue.model';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  issue: Partial<Issue> = {};
  motorcycles: any[] = [];
  isEdit = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private issuesService: IssuesService,
    private motorcyclesService: MotorcyclesService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.isEdit = !!id;

    if (this.isEdit) {
      this.issuesService.getById(id).subscribe((issue) => {
        this.issue = issue;
        this.issue.date_reported = issue.date_reported ? new Date(issue.date_reported).toISOString().slice(0, 16) : '';
      });
    }

    this.motorcyclesService.getAll().subscribe((motorcycles) => {
      this.motorcycles = motorcycles;
    });
  }

  save(): void {
    if (this.isEdit) {
      this.issuesService.update(this.issue.id!, this.issue).subscribe(() => {
        this.router.navigate(['/issues']);
      });
    } else {
      this.issuesService.create(this.issue).subscribe(() => {
        this.router.navigate(['/issues']);
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/issues']);
  }
}
