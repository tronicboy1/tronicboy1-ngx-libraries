import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'startup-add-member-details-form',
  templateUrl: './add-member-details-form.component.html',
  styleUrls: ['./add-member-details-form.component.css'],
})
export class AddMemberDetailsFormComponent {
  @Output() submitted = new EventEmitter<void>();
}