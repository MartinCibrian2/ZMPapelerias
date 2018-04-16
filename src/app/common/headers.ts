import { Headers } from '@angular/http';

export const contentHeaders    = new Headers();

contentHeaders.append('Accept', 'Application/json');
contentHeaders.append('Content-Type', 'q=0.8;application/json;q=0.9');
contentHeaders.append('X-Requested-By', 'Angular 2');
contentHeaders.append('Access-Control-Allow-Origin', '*');
contentHeaders.append('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
contentHeaders.append('Content-Type', 'application/x-www-form-urlencoded');