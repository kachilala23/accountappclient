import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OwnerForCreation } from './../../_interfaces/ownerForCreation.model';
import { ErrorHandlerService } from './../../shared/services/error-handler.service';
import { RepositoryService } from './../../shared/services/repository.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-owner-create',
  templateUrl: './owner-create.component.html',
  styleUrls: ['./owner-create.component.css']
})
export class OwnerCreateComponent implements OnInit {
  public errorMessage = '';

  public ownerForm: FormGroup;

  // tslint:disable-next-line:max-line-length
  constructor(private repository: RepositoryService, private errorHandler: ErrorHandlerService, private router: Router, private datePipe: DatePipe) { }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.ownerForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      dateOfBirth: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required, Validators.maxLength(100)])
    });
  }

  public validateControl = (controlName: string) => {
    if (this.ownerForm.controls[controlName].invalid && this.ownerForm.controls[controlName].touched)
      return true;

    return false;
  }

  public hasError = (controlName: string, errorName: string) => {
    if (this.ownerForm.controls[controlName].hasError(errorName))
      return true;

    return false;
  }

  public executeDatePicker = (event) => {
    this.ownerForm.patchValue({ dateOfBirth: event });
  }

  public createOwner = (ownerFormValue) => {
    if (this.ownerForm.valid) {
      this.executeOwnerCreation(ownerFormValue);
    }
  }

  private executeOwnerCreation = (ownerFormValue) => {
    const owner: OwnerForCreation = {
      name: ownerFormValue.name,
      dateOfBirth: this.datePipe.transform(ownerFormValue.dateOfBirth, 'yyyy-MM-dd'),
      address: ownerFormValue.address
    };

    const apiUrl = 'api/owner';
    this.repository.create(apiUrl, owner)
      .subscribe(res => {
          // @ts-ignore
          $('#successModal').modal();
        },
        (error => {
          this.errorHandler.handleError(error);
          this.errorMessage = this.errorHandler.errorMessage;
        })
      );
  }

  // tslint:disable-next-line:typedef
  public redirectToOwnerList(){
    this.router.navigate(['/owner/list']);
  }

}
