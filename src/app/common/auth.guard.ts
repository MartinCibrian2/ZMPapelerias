import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard
{
  constructor(
      //private router: Router,
  ){ }

  canActivate( ){
    if( localStorage.getItem('currentUser') ){
      return true;
    }

    return false;
  }
}