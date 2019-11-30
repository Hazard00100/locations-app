import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthorizationService } from './authorization.service';
import { Globals } from '../../globals';

@Injectable()
export class HelpService {
  constructor(
    private authorizationService: AuthorizationService,
    private http: HttpClient,
    private globals: Globals,
  ) { }
}
