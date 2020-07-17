import { NgModule } from '@angular/core';
import { AddressComponent } from './address.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
export class AddressModule {
}
AddressModule.decorators = [
    { type: NgModule, args: [{
                declarations: [AddressComponent],
                imports: [
                    GooglePlaceModule,
                    FontAwesomeModule,
                    FormsModule,
                    ReactiveFormsModule,
                    CommonModule
                ],
                exports: [AddressComponent]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkcmVzcy5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9hZGRyZXNzL3NyYy9saWIvYWRkcmVzcy5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNuRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNyRSxPQUFPLEVBQUUsV0FBVyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBZS9DLE1BQU0sT0FBTyxhQUFhOzs7WUFaekIsUUFBUSxTQUFDO2dCQUNSLFlBQVksRUFBRSxDQUFDLGdCQUFnQixDQUFDO2dCQUNoQyxPQUFPLEVBQUU7b0JBQ1AsaUJBQWlCO29CQUNqQixpQkFBaUI7b0JBQ2pCLFdBQVc7b0JBQ1gsbUJBQW1CO29CQUNuQixZQUFZO2lCQUViO2dCQUNELE9BQU8sRUFBRSxDQUFDLGdCQUFnQixDQUFDO2FBQzVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFkZHJlc3NDb21wb25lbnQgfSBmcm9tICcuL2FkZHJlc3MuY29tcG9uZW50JztcbmltcG9ydCB7IEdvb2dsZVBsYWNlTW9kdWxlIH0gZnJvbSBcIm5neC1nb29nbGUtcGxhY2VzLWF1dG9jb21wbGV0ZVwiO1xuaW1wb3J0IHsgRm9udEF3ZXNvbWVNb2R1bGUgfSBmcm9tICdAZm9ydGF3ZXNvbWUvYW5ndWxhci1mb250YXdlc29tZSc7XG5pbXBvcnQgeyBGb3Jtc01vZHVsZSwgUmVhY3RpdmVGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJzsgXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW0FkZHJlc3NDb21wb25lbnRdLFxuICBpbXBvcnRzOiBbXG4gICAgR29vZ2xlUGxhY2VNb2R1bGUsXG4gICAgRm9udEF3ZXNvbWVNb2R1bGUsXG4gICAgRm9ybXNNb2R1bGUsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgIFJlYWN0aXZlRm9ybXNNb2R1bGUgLFxuICAgIENvbW1vbk1vZHVsZVxuXG4gIF0sXG4gIGV4cG9ydHM6IFtBZGRyZXNzQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBBZGRyZXNzTW9kdWxlIHsgfVxuIl19