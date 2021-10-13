import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormControl, FormGroupDirective, NgForm} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || form?.invalid || control.touched || isSubmitted));
  }
}

class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): any {
    return control?.dirty && control?.touched && form?.errors?.notMatch;
  }
}

@Component({
  selector: 'app-login-panel',
  templateUrl: './login-panel.component.html',
  styleUrls: ['./login-panel.component.css']
})
export class LoginPanelComponent implements OnInit {

  isRegister = false;

  loginForm: FormGroup
  registerForm: FormGroup

  @Output() panelclose = new EventEmitter();
  @Output() login = new EventEmitter();
  @Output() register = new EventEmitter();

  matcher = new CrossFieldErrorMatcher();

  get login_username(){
    return this.loginForm.get('username');
  }

  get login_password(){
    return this.loginForm.get('password');
  }

  get reg_username(){
    return this.registerForm.get('username');
  }

  get reg_password(){
    return this.registerForm.get('password');
  }

  get reg_confirm(){
    return this.registerForm.get('confirm');
  }

  constructor(private fb: FormBuilder) { 
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirm: ['', [Validators.required]]
    },
    {
      validators: this.matchPassword('password', 'confirm')
    });
  }

  ngOnInit(): void {
  }

  onToRegisterBtnClicked(){
    this.isRegister = true;
  }

  onCancelBtnClicked(){
    this.isRegister = false;
  }

  onLoginBtnClicked(){
    this.panelclose.emit();
    this.login.emit(this.loginForm.value);
  }

  onRegisterBtnClicked(){
    this.panelclose.emit();
    this.register.emit(this.registerForm.value);
  }

  onCloseBtnClicked(){
    this.panelclose.emit()
  }

  onLoginSubmited(){
    if (this.loginForm.valid){
      console.log(this.loginForm.value);
    }
  }

  onRegisterSubmited(){
    if(this.registerForm.valid){
      console.log(this.registerForm.value);
    }
  }

  matchPassword(control1: string, control2: string): ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(control1)?.value;
      const confirm = control.get(control2)?.value;

      if (password !== confirm){
        return { notMatch: true };
      }
      else{
        return null;
      }

    }
  }

  

}
