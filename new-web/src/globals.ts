import { Injectable } from '@angular/core';
import { GOOGLE_API_API_KEY, API_URL } from './gk'
@Injectable()
export class Globals {
  API_URL: string = API_URL;
  GOOGLE_API_API_KEY: string = GOOGLE_API_API_KEY;
}
