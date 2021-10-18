import { Component, EventEmitter, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormControl, FormGroupDirective, NgForm, AsyncValidator, AsyncValidatorFn} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { concatMap, map, tap } from 'rxjs/operators';
import { RestAPIService } from '../rest-api.service';

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
export class LoginPanelComponent implements OnInit{

  isRegister = false;

  loginForm: FormGroup
  registerForm: FormGroup

  warning = "";

  @Output() panelclose = new EventEmitter();
  @Output() login = new EventEmitter();
  @Output() register = new EventEmitter();

  matcher = new CrossFieldErrorMatcher();

  errSub$ = new BehaviorSubject<ValidationErrors | null>(null);

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

  constructor(private fb: FormBuilder, private restAPI: RestAPIService) { 
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required], []]
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
    this.putError();
  }

  onToRegisterBtnClicked(){
    this.isRegister = true;
  }

  onCancelBtnClicked(){
    this.isRegister = false;
  }

  onLoginBtnClicked(){
    this.loginValidate(this.loginForm.get('username')!, this.loginForm.get('password')!).subscribe(
      res => {
        if (res){
          this.loginForm.setErrors(res);
          this.errSub$.next(res);
        }else{
          this.errSub$.next(null);
          this.panelclose.emit();
          this.login.emit(this.loginForm.value);
        }
      }
    );
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
      // console.log(this.loginForm.value);
    }
  }

  onRegisterSubmited(){
    if(this.registerForm.valid){
      // console.log(this.registerForm.value);
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

  loginValidate(control1: AbstractControl, control2: AbstractControl): Observable<ValidationErrors | null> {
    const username = control1.value;
    const password = control2.value;
    return this.restAPI.check(username, password).pipe(
      map( (res) =>{
        let check = null;
        if (res.res !== 'pass'){
          if (res.res === 'username'){
            check = {authErr: 'username'};
          }else if(res.res === 'password'){
            check = {authErr: 'password'};
          }else{
            check = {authErr: 'unknown'};
          }
        }else{
          check = null;
        }
        return check
      })
     
    );
  }

  putError(){
    this.errSub$.subscribe(
      err => {
        if (err){
          if (err.authErr){
            this.warning = 'Username or Password is incorrect.';
          }
        }else{
          this.warning = '';
        }
      }
    );
    
  }
}
