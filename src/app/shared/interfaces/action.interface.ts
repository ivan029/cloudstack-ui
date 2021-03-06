import { Observable } from 'rxjs/Observable';
import { BaseModel } from '../models/base.model';


export interface Action<M extends BaseModel> {
  name: string;
  icon?: string;
  hidden?(model: M): boolean;
  canActivate?(model: M): boolean;
  activate(model: M, ...rest: Array<any>): Observable<any>;
}
