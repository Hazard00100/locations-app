import { Injectable } from '@angular/core';
import { GOOGLE_API_API_KEY } from './gk'
@Injectable()
export class Globals {
  API_URL: string = 'http://localhost:5577/';
  GOOGLE_API_API_KEY: string = GOOGLE_API_API_KEY;
}
