import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthorizationService } from './authorization.service';
import { Globals } from '../../globals';

@Injectable()
export class ContactService {
  constructor(
    private authorizationService: AuthorizationService,
    private http: HttpClient,
    private globals: Globals,
  ) { }
}
