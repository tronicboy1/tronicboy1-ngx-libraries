import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgxObservableDirective } from './ngx-observable.directive';
import { ObserverService, ObserverSettings } from './observer.service';

@NgModule({
  declarations: [NgxObservableDirective],
  imports: [],
  exports: [NgxObservableDirective],
})
export class NgxObservableDirectiveModule {
  static forRoot(
    settings: IntersectionObserverInit = {}
  ): ModuleWithProviders<NgxObservableDirectiveModule> {
    return {
      ngModule: NgxObservableDirectiveModule,
      providers: [{ provide: ObserverSettings, useValue: { settings } }],
    };
  }
}