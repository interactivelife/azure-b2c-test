import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
  spinnerActive: number = 0;
  constructor(private spinnerService: NgxSpinnerService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.spinnerActive++;
    this.spinnerService.show();

    return next.handle(req).pipe(
      finalize(() => {
        this.spinnerActive--;
        if(this.spinnerActive == 0)
         this.spinnerService.hide();
      })
    );
  }
}