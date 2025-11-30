import { Component, OnInit } from '@angular/core';
import { IssuesService } from 'src/app/services/issue/issues.service';
import { Issue } from 'src/app/models/issue/issue.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  issues: Issue[] = [];

  constructor(private issuesService: IssuesService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.issuesService.getAll().subscribe((data) => {
      this.issues = data;
    });
  }

  delete(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este issue?')) {
      this.issuesService.delete(id).subscribe(() => {
        this.load();
      });
    }
  }
}
