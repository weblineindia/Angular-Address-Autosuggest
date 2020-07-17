import { Component, Input, Output, EventEmitter } from '@angular/core';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
export class AddressComponent {
    constructor() {
        this.ADDRESS_COMPONENTS = {
            subpremise: 'short_name',
            street_number: 'short_name',
            route: 'long_name',
            locality: 'long_name',
            administrative_area_level_1: 'short_name',
            administrative_area_level_2: 'long_name',
            country: 'long_name',
            postal_code: 'short_name',
            street_name: 'short_name'
        };
        this.faPlus = faPlus;
        this.faMinus = faMinus;
        this.streetNumber = '';
        this.selectedAddressArray = [];
        this.isShowStreetField = true;
        this.addressValue = {
            // Array of Object of multiple address
            type: Array,
            default: [
                {
                    address: '',
                    geolocation: { x: 0, y: 0 },
                    country: '',
                    locality: '',
                    postalcode: '',
                    state: '',
                    province: '',
                    fulladdress: '',
                    streetaddress: '',
                    isDuplicate: false
                }
            ]
        };
        this.maxlength = 50;
        this.name = '';
        this.id = '';
        this.disabled = false;
        this.value = '';
        this.isMultiple = true;
        this.placeholder = 'Email';
        this.isShowPlus = false;
        this.tabindex = 0;
        this.index = 0;
        this.changeAddress = new EventEmitter();
        this.onPlus = new EventEmitter();
        this.blur = new EventEmitter();
        this.focus = new EventEmitter();
    }
    ngOnInit() { }
    handleAddressChange(event, index, addressArray) {
        const place = event;
        if (place.address_components !== undefined) {
            this.selectedAddressArray[index] = this.formatResult(place);
            let dataObj = { data: this.formatResult(place), index: index };
            this.changeAddress.emit(dataObj);
        }
        else {
            this.value = place.name;
            const data = [];
            var geolocation;
            if (place.geometry !== undefined) {
                geolocation = {
                    x: place.geometry.location.lat() === undefined
                        ? ''
                        : place.geometry.location.lat(),
                    y: place.geometry.location.lng() === undefined
                        ? ''
                        : place.geometry.location.lat()
                };
            }
            else {
                geolocation = {
                    x: '',
                    y: ''
                };
            }
            data.push({
                address: this.value,
                geolocation: geolocation,
                countryCode: 'it',
                fulladdress: this.value,
                country: '',
                locality: '',
                streetaddress: '',
                premise: '',
                postalcode: '',
                state: '',
                province: '',
                isDuplicate: false
            });
            this.selectedAddressArray.push(data);
            let dataObj = { data: data, index: index };
            this.changeAddress.emit(dataObj);
        }
        this.uniqueAddressValidate(addressArray, index, event);
    }
    uniqueAddressValidate(addressArray, index, event) {
        addressArray.map((item, key) => {
            if (key !== index) {
                if (item.address[0].address === event.formatted_address) {
                    addressArray[index].address[0].isDuplicate = true;
                }
            }
        });
    }
    onBlur(event, index) {
        let data = { event: event, index: index };
        this.blur.emit(data);
    }
    onFocus(event, index) {
        let data = { event: event, index: index };
        this.focus.emit(data);
    }
    onPlusClick() {
        this.onPlus.emit();
    }
    formatResult(place) {
        const returnData = [];
        let countryName = '';
        let locality = '';
        let postalCode = '';
        let province = '';
        let streetName = '';
        var streetNumber;
        let state = '';
        for (let i = 0; i < place.address_components.length; i++) {
            const addressType = place.address_components[i].types[0];
            const addressTypeValue = place.address_components[i][this.ADDRESS_COMPONENTS[addressType]];
            switch (addressType) {
                case 'country':
                    countryName = addressTypeValue;
                    break;
                case 'locality':
                    locality = addressTypeValue;
                    break;
                case 'postal_code':
                    postalCode = addressTypeValue;
                    break;
                case 'administrative_area_level_1':
                    state = addressTypeValue;
                    break;
                case 'administrative_area_level_2':
                    province = addressTypeValue;
                    break;
                case 'street_number':
                    streetNumber = addressTypeValue;
                    break;
                case 'street_name':
                    streetName = addressTypeValue;
                    break;
            }
            const geolocation = {
                x: place.geometry.location.lat(),
                y: place.geometry.location.lng()
            };
            const commaSeparator = streetNumber ? ', ' : '';
            const space = streetName ? ' ' : '';
            let selectedAddress = '';
            let address = place.formatted_address;
            if (streetNumber > 0) {
                selectedAddress = place.formatted_address;
            }
            else {
                if (streetNumber !== undefined) {
                    selectedAddress =
                        streetNumber + commaSeparator + place.formatted_address;
                }
                else {
                    selectedAddress = place.formatted_address;
                }
            }
            var returnObject = {
                geolocation: geolocation,
                fulladdress: selectedAddress,
                address: selectedAddress,
                country: countryName,
                locality: locality,
                streetaddress: streetNumber + space + streetName,
                premise: countryName,
                postalcode: postalCode,
                state: state,
                province: province,
                countryCode: 'it',
                isDuplicate: false
            };
        }
        if (returnObject.streetaddress === '' ||
            returnObject.streetaddress === 'undefined') {
            this.notStreetNumber = true;
        }
        else {
            this.notStreetNumber = false;
        }
        returnData.push(returnObject);
        return returnData;
    }
}
AddressComponent.decorators = [
    { type: Component, args: [{
                selector: 'lib-address',
                template: "\n<input\nngx-google-places-autocomplete\n[value]=\"\n  addressValue.fulladdress !== undefined ? addressValue.fulladdress : ''\n\"\n[options]=\"addressOptions\"\n#placesRef=\"ngx-places\"\n(onAddressChange)=\"handleAddressChange($event, index, addressArray)\"\nclass=\"form-control\"\n[placeholder]=\"placeholder\"\n[maxLength]=\"maxlength\"\n[name]=\"name\"\n[id]=\"id\"\n(blur)=\"onBlur($event, index)\"\n(focus)=\"onFocus($event, index)\"\n[disabled]=\"disabled\"\n[tabindex]=tabindex\n/>\n<span *ngIf=\"isMultiple && addressValue !== ''\" class=\"add-remove\">\n<span>\n  <fa-icon [icon]=\"faMinus\"></fa-icon>\n</span>\n<span *ngIf=\"isShowPlus\" class=\"plus-icon\">\n  <fa-icon [icon]=\"faPlus\" (click)=\"onPlusClick()\"></fa-icon>\n</span>\n</span>\n\n<p\n[ngClass]=\"{\n  control: true,\n  'error-msg':\n    addressValue[0].isDuplicate !== undefined\n      ? addressValue[0].isDuplicate\n      : false\n}\"\n*ngIf=\"addressValue !== '' ? addressValue[0].isDuplicate : false\"\n>\n<span>{{addressUniqueErrorMsg}}</span>\n</p>\n",
                styles: [".form-control{border:1px solid #ccc;box-sizing:border-box;display:inline-block;margin:8px 0;padding:12px 20px;width:50%}p.control.error-msg{color:red}.plus-icon{margin-left:5px}"]
            },] }
];
AddressComponent.propDecorators = {
    isShowStreetField: [{ type: Input }],
    addressValue: [{ type: Input }],
    addressOptions: [{ type: Input }],
    addressArray: [{ type: Input }],
    addressUniqueErrorMsg: [{ type: Input }],
    maxlength: [{ type: Input }],
    name: [{ type: Input }],
    id: [{ type: Input }],
    disabled: [{ type: Input }],
    value: [{ type: Input }],
    isMultiple: [{ type: Input }],
    placeholder: [{ type: Input }],
    isShowPlus: [{ type: Input }],
    tabindex: [{ type: Input }],
    index: [{ type: Input }],
    changeAddress: [{ type: Output }],
    onPlus: [{ type: Output }],
    blur: [{ type: Output }],
    focus: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkcmVzcy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9hZGRyZXNzL3NyYy9saWIvYWRkcmVzcy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDYixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBT3BFLE1BQU0sT0FBTyxnQkFBZ0I7SUFMN0I7UUFPRSx1QkFBa0IsR0FBUTtZQUN4QixVQUFVLEVBQUUsWUFBWTtZQUN4QixhQUFhLEVBQUUsWUFBWTtZQUMzQixLQUFLLEVBQUUsV0FBVztZQUNsQixRQUFRLEVBQUUsV0FBVztZQUNyQiwyQkFBMkIsRUFBRSxZQUFZO1lBQ3pDLDJCQUEyQixFQUFFLFdBQVc7WUFDeEMsT0FBTyxFQUFFLFdBQVc7WUFDcEIsV0FBVyxFQUFFLFlBQVk7WUFDekIsV0FBVyxFQUFFLFlBQVk7U0FDMUIsQ0FBQztRQUVGLFdBQU0sR0FBUSxNQUFNLENBQUM7UUFDckIsWUFBTyxHQUFRLE9BQU8sQ0FBQztRQUV2QixpQkFBWSxHQUFXLEVBQUUsQ0FBQztRQUMxQix5QkFBb0IsR0FBUSxFQUFFLENBQUM7UUFFdEIsc0JBQWlCLEdBQVksSUFBSSxDQUFDO1FBQ2xDLGlCQUFZLEdBQVE7WUFDM0Isc0NBQXNDO1lBQ3RDLElBQUksRUFBRSxLQUFLO1lBQ1gsT0FBTyxFQUFFO2dCQUNQO29CQUNFLE9BQU8sRUFBRSxFQUFFO29CQUNYLFdBQVcsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtvQkFDM0IsT0FBTyxFQUFFLEVBQUU7b0JBQ1gsUUFBUSxFQUFFLEVBQUU7b0JBQ1osVUFBVSxFQUFFLEVBQUU7b0JBQ2QsS0FBSyxFQUFFLEVBQUU7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QVU7Z0JBQ3RCLEtBQUssRUFBRSxLQUFLO2dCQUNaLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixXQUFXLEVBQUUsSUFBSTtnQkFDakIsV0FBVyxFQUFFLEtBQUs7YUFDbkIsQ0FBQztTQUNIO1FBQ0QsSUFDRSxZQUFZLENBQUMsYUFBYSxLQUFLLEVBQUU7WUFDakMsWUFBWSxDQUFDLGFBQWEsS0FBSyxXQUFXLEVBQzFDO1lBQ0EsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7U0FDN0I7YUFBTTtZQUNMLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO1NBQzlCO1FBQ0QsVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUM5QixPQUFPLFVBQVUsQ0FBQztJQUNwQixDQUFDOzs7WUF0TkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxhQUFhO2dCQUN2Qix3aENBQXVDOzthQUV4Qzs7O2dDQXFCRSxLQUFLOzJCQUNMLEtBQUs7NkJBa0JMLEtBQUs7MkJBQ0wsS0FBSztvQ0FDTCxLQUFLO3dCQUNMLEtBQUs7bUJBQ0wsS0FBSztpQkFDTCxLQUFLO3VCQUNMLEtBQUs7b0JBQ0wsS0FBSzt5QkFDTCxLQUFLOzBCQUNMLEtBQUs7eUJBQ0wsS0FBSzt1QkFDTCxLQUFLO29CQUNMLEtBQUs7NEJBQ0wsTUFBTTtxQkFDTixNQUFNO21CQUNOLE1BQU07b0JBQ04sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgZmFQbHVzLCBmYU1pbnVzIH0gZnJvbSAnQGZvcnRhd2Vzb21lL2ZyZWUtc29saWQtc3ZnLWljb25zJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbGliLWFkZHJlc3MnLFxuICB0ZW1wbGF0ZVVybDogJy4vYWRkcmVzcy5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2FkZHJlc3MuY29tcG9uZW50LmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIEFkZHJlc3NDb21wb25lbnQge1xuXG4gIEFERFJFU1NfQ09NUE9ORU5UUzogYW55ID0ge1xuICAgIHN1YnByZW1pc2U6ICdzaG9ydF9uYW1lJyxcbiAgICBzdHJlZXRfbnVtYmVyOiAnc2hvcnRfbmFtZScsXG4gICAgcm91dGU6ICdsb25nX25hbWUnLFxuICAgIGxvY2FsaXR5OiAnbG9uZ19uYW1lJyxcbiAgICBhZG1pbmlzdHJhdGl2ZV9hcmVhX2xldmVsXzE6ICdzaG9ydF9uYW1lJyxcbiAgICBhZG1pbmlzdHJhdGl2ZV9hcmVhX2xldmVsXzI6ICdsb25nX25hbWUnLFxuICAgIGNvdW50cnk6ICdsb25nX25hbWUnLFxuICAgIHBvc3RhbF9jb2RlOiAnc2hvcnRfbmFtZScsXG4gICAgc3RyZWV0X25hbWU6ICdzaG9ydF9uYW1lJ1xuICB9O1xuXG4gIGZhUGx1czogYW55ID0gZmFQbHVzO1xuICBmYU1pbnVzOiBhbnkgPSBmYU1pbnVzO1xuICBub3RTdHJlZXROdW1iZXI6IEJvb2xlYW47XG4gIHN0cmVldE51bWJlcjogU3RyaW5nID0gJyc7XG4gIHNlbGVjdGVkQWRkcmVzc0FycmF5OiBhbnkgPSBbXTtcblxuICBASW5wdXQoKSBpc1Nob3dTdHJlZXRGaWVsZDogQm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIGFkZHJlc3NWYWx1ZTogYW55ID0ge1xuICAgIC8vIEFycmF5IG9mIE9iamVjdCBvZiBtdWx0aXBsZSBhZGRyZXNzXG4gICAgdHlwZTogQXJyYXksXG4gICAgZGVmYXVsdDogW1xuICAgICAge1xuICAgICAgICBhZGRyZXNzOiAnJyxcbiAgICAgICAgZ2VvbG9jYXRpb246IHsgeDogMCwgeTogMCB9LFxuICAgICAgICBjb3VudHJ5OiAnJyxcbiAgICAgICAgbG9jYWxpdHk6ICcnLFxuICAgICAgICBwb3N0YWxjb2RlOiAnJyxcbiAgICAgICAgc3RhdGU6ICcnLFxuICAgICAgICBwcm92aW5jZTogJycsXG4gICAgICAgIGZ1bGxhZGRyZXNzOiAnJyxcbiAgICAgICAgc3RyZWV0YWRkcmVzczogJycsXG4gICAgICAgIGlzRHVwbGljYXRlOiBmYWxzZVxuICAgICAgfVxuICAgIF1cbiAgfTtcbiAgQElucHV0KCkgYWRkcmVzc09wdGlvbnM6IGFueTtcbiAgQElucHV0KCkgYWRkcmVzc0FycmF5OiBhbnk7XG4gIEBJbnB1dCgpIGFkZHJlc3NVbmlxdWVFcnJvck1zZzogU3RyaW5nO1xuICBASW5wdXQoKSBtYXhsZW5ndGg6IE51bWJlciA9IDUwO1xuICBASW5wdXQoKSBuYW1lOiBTdHJpbmcgPSAnJztcbiAgQElucHV0KCkgaWQ6IFN0cmluZyA9ICcnO1xuICBASW5wdXQoKSBkaXNhYmxlZDogQm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSB2YWx1ZTogU3RyaW5nID0gJyc7XG4gIEBJbnB1dCgpIGlzTXVsdGlwbGU6IEJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXQoKSBwbGFjZWhvbGRlcjogU3RyaW5nID0gJ0VtYWlsJztcbiAgQElucHV0KCkgaXNTaG93UGx1czogQm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSB0YWJpbmRleDogTnVtYmVyID0gMDtcbiAgQElucHV0KCkgaW5kZXg6IE51bWJlciA9IDA7XG4gIEBPdXRwdXQoKSBjaGFuZ2VBZGRyZXNzOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgb25QbHVzOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgYmx1cjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIGZvY3VzOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIG5nT25Jbml0KCkge31cblxuICBoYW5kbGVBZGRyZXNzQ2hhbmdlKGV2ZW50LCBpbmRleCwgYWRkcmVzc0FycmF5KSB7XG4gICAgY29uc3QgcGxhY2UgPSBldmVudDtcbiAgICBpZiAocGxhY2UuYWRkcmVzc19jb21wb25lbnRzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRBZGRyZXNzQXJyYXlbaW5kZXhdID0gdGhpcy5mb3JtYXRSZXN1bHQocGxhY2UpO1xuICAgICAgbGV0IGRhdGFPYmogPSB7IGRhdGE6IHRoaXMuZm9ybWF0UmVzdWx0KHBsYWNlKSwgaW5kZXg6IGluZGV4IH07XG4gICAgICB0aGlzLmNoYW5nZUFkZHJlc3MuZW1pdChkYXRhT2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy52YWx1ZSA9IHBsYWNlLm5hbWU7XG4gICAgICBjb25zdCBkYXRhID0gW107XG4gICAgICB2YXIgZ2VvbG9jYXRpb247XG4gICAgICBpZiAocGxhY2UuZ2VvbWV0cnkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBnZW9sb2NhdGlvbiA9IHtcbiAgICAgICAgICB4OlxuICAgICAgICAgICAgcGxhY2UuZ2VvbWV0cnkubG9jYXRpb24ubGF0KCkgPT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICA/ICcnXG4gICAgICAgICAgICAgIDogcGxhY2UuZ2VvbWV0cnkubG9jYXRpb24ubGF0KCksXG4gICAgICAgICAgeTpcbiAgICAgICAgICAgIHBsYWNlLmdlb21ldHJ5LmxvY2F0aW9uLmxuZygpID09PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgPyAnJ1xuICAgICAgICAgICAgICA6IHBsYWNlLmdlb21ldHJ5LmxvY2F0aW9uLmxhdCgpXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBnZW9sb2NhdGlvbiA9IHtcbiAgICAgICAgICB4OiAnJyxcbiAgICAgICAgICB5OiAnJ1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgZGF0YS5wdXNoKHtcbiAgICAgICAgYWRkcmVzczogdGhpcy52YWx1ZSxcbiAgICAgICAgZ2VvbG9jYXRpb246IGdlb2xvY2F0aW9uLFxuICAgICAgICBjb3VudHJ5Q29kZTogJ2l0JyxcbiAgICAgICAgZnVsbGFkZHJlc3M6IHRoaXMudmFsdWUsXG4gICAgICAgIGNvdW50cnk6ICcnLFxuICAgICAgICBsb2NhbGl0eTogJycsXG4gICAgICAgIHN0cmVldGFkZHJlc3M6ICcnLFxuICAgICAgICBwcmVtaXNlOiAnJyxcbiAgICAgICAgcG9zdGFsY29kZTogJycsXG4gICAgICAgIHN0YXRlOiAnJyxcbiAgICAgICAgcHJvdmluY2U6ICcnLFxuICAgICAgICBpc0R1cGxpY2F0ZTogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgdGhpcy5zZWxlY3RlZEFkZHJlc3NBcnJheS5wdXNoKGRhdGEpO1xuICAgICAgbGV0IGRhdGFPYmogPSB7IGRhdGE6IGRhdGEsIGluZGV4OiBpbmRleCB9O1xuICAgICAgdGhpcy5jaGFuZ2VBZGRyZXNzLmVtaXQoZGF0YU9iaik7XG4gICAgfVxuICAgIHRoaXMudW5pcXVlQWRkcmVzc1ZhbGlkYXRlKGFkZHJlc3NBcnJheSwgaW5kZXgsIGV2ZW50KTtcbiAgfVxuXG4gIHVuaXF1ZUFkZHJlc3NWYWxpZGF0ZShhZGRyZXNzQXJyYXksIGluZGV4LCBldmVudCkge1xuICAgIGFkZHJlc3NBcnJheS5tYXAoKGl0ZW0sIGtleSkgPT4ge1xuICAgICAgaWYgKGtleSAhPT0gaW5kZXgpIHtcbiAgICAgICAgaWYgKGl0ZW0uYWRkcmVzc1swXS5hZGRyZXNzID09PSBldmVudC5mb3JtYXR0ZWRfYWRkcmVzcykge1xuICAgICAgICAgIGFkZHJlc3NBcnJheVtpbmRleF0uYWRkcmVzc1swXS5pc0R1cGxpY2F0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG9uQmx1cihldmVudCwgaW5kZXgpIHtcbiAgICBsZXQgZGF0YSA9IHsgZXZlbnQ6IGV2ZW50LCBpbmRleDogaW5kZXggfTtcbiAgICB0aGlzLmJsdXIuZW1pdChkYXRhKTtcbiAgfVxuICBvbkZvY3VzKGV2ZW50LCBpbmRleCkge1xuICAgIGxldCBkYXRhID0geyBldmVudDogZXZlbnQsIGluZGV4OiBpbmRleCB9O1xuICAgIHRoaXMuZm9jdXMuZW1pdChkYXRhKTtcbiAgfVxuICBvblBsdXNDbGljaygpIHtcbiAgICB0aGlzLm9uUGx1cy5lbWl0KCk7XG4gIH1cblxuICBmb3JtYXRSZXN1bHQocGxhY2UpIHtcbiAgICBjb25zdCByZXR1cm5EYXRhID0gW107XG4gICAgbGV0IGNvdW50cnlOYW1lID0gJyc7XG4gICAgbGV0IGxvY2FsaXR5ID0gJyc7XG4gICAgbGV0IHBvc3RhbENvZGUgPSAnJztcbiAgICBsZXQgcHJvdmluY2UgPSAnJztcbiAgICBsZXQgc3RyZWV0TmFtZSA9ICcnO1xuICAgIHZhciBzdHJlZXROdW1iZXI7XG4gICAgbGV0IHN0YXRlID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGFjZS5hZGRyZXNzX2NvbXBvbmVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGFkZHJlc3NUeXBlID0gcGxhY2UuYWRkcmVzc19jb21wb25lbnRzW2ldLnR5cGVzWzBdO1xuXG4gICAgICBjb25zdCBhZGRyZXNzVHlwZVZhbHVlID1cbiAgICAgICAgcGxhY2UuYWRkcmVzc19jb21wb25lbnRzW2ldW3RoaXMuQUREUkVTU19DT01QT05FTlRTW2FkZHJlc3NUeXBlXV07XG4gICAgICBzd2l0Y2ggKGFkZHJlc3NUeXBlKSB7XG4gICAgICAgIGNhc2UgJ2NvdW50cnknOlxuICAgICAgICAgIGNvdW50cnlOYW1lID0gYWRkcmVzc1R5cGVWYWx1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnbG9jYWxpdHknOlxuICAgICAgICAgIGxvY2FsaXR5ID0gYWRkcmVzc1R5cGVWYWx1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncG9zdGFsX2NvZGUnOlxuICAgICAgICAgIHBvc3RhbENvZGUgPSBhZGRyZXNzVHlwZVZhbHVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdhZG1pbmlzdHJhdGl2ZV9hcmVhX2xldmVsXzEnOlxuICAgICAgICAgIHN0YXRlID0gYWRkcmVzc1R5cGVWYWx1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnYWRtaW5pc3RyYXRpdmVfYXJlYV9sZXZlbF8yJzpcbiAgICAgICAgICBwcm92aW5jZSA9IGFkZHJlc3NUeXBlVmFsdWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3N0cmVldF9udW1iZXInOlxuICAgICAgICAgIHN0cmVldE51bWJlciA9IGFkZHJlc3NUeXBlVmFsdWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3N0cmVldF9uYW1lJzpcbiAgICAgICAgICBzdHJlZXROYW1lID0gYWRkcmVzc1R5cGVWYWx1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNvbnN0IGdlb2xvY2F0aW9uID0ge1xuICAgICAgICB4OiBwbGFjZS5nZW9tZXRyeS5sb2NhdGlvbi5sYXQoKSxcbiAgICAgICAgeTogcGxhY2UuZ2VvbWV0cnkubG9jYXRpb24ubG5nKClcbiAgICAgIH07XG4gICAgICBjb25zdCBjb21tYVNlcGFyYXRvciA9IHN0cmVldE51bWJlciA/ICcsICcgOiAnJztcbiAgICAgIGNvbnN0IHNwYWNlID0gc3RyZWV0TmFtZSA/ICcgJyA6ICcnO1xuICAgICAgbGV0IHNlbGVjdGVkQWRkcmVzcyA9ICcnO1xuICAgICAgbGV0IGFkZHJlc3MgPSBwbGFjZS5mb3JtYXR0ZWRfYWRkcmVzcztcbiAgICAgIGlmIChzdHJlZXROdW1iZXIgPiAwKSB7XG4gICAgICAgIHNlbGVjdGVkQWRkcmVzcyA9IHBsYWNlLmZvcm1hdHRlZF9hZGRyZXNzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHN0cmVldE51bWJlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgc2VsZWN0ZWRBZGRyZXNzID1cbiAgICAgICAgICAgIHN0cmVldE51bWJlciArIGNvbW1hU2VwYXJhdG9yICsgcGxhY2UuZm9ybWF0dGVkX2FkZHJlc3M7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZWN0ZWRBZGRyZXNzID0gcGxhY2UuZm9ybWF0dGVkX2FkZHJlc3M7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZhciByZXR1cm5PYmplY3QgPSB7XG4gICAgICAgIGdlb2xvY2F0aW9uOiBnZW9sb2NhdGlvbixcbiAgICAgICAgZnVsbGFkZHJlc3M6IHNlbGVjdGVkQWRkcmVzcyxcbiAgICAgICAgYWRkcmVzczogc2VsZWN0ZWRBZGRyZXNzLFxuICAgICAgICBjb3VudHJ5OiBjb3VudHJ5TmFtZSxcbiAgICAgICAgbG9jYWxpdHk6IGxvY2FsaXR5LFxuICAgICAgICBzdHJlZXRhZGRyZXNzOiBzdHJlZXROdW1iZXIgKyBzcGFjZSArIHN0cmVldE5hbWUsXG4gICAgICAgIHByZW1pc2U6IGNvdW50cnlOYW1lLFxuICAgICAgICBwb3N0YWxjb2RlOiBwb3N0YWxDb2RlLFxuICAgICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICAgIHByb3ZpbmNlOiBwcm92aW5jZSxcbiAgICAgICAgY291bnRyeUNvZGU6ICdpdCcsXG4gICAgICAgIGlzRHVwbGljYXRlOiBmYWxzZVxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKFxuICAgICAgcmV0dXJuT2JqZWN0LnN0cmVldGFkZHJlc3MgPT09ICcnIHx8XG4gICAgICByZXR1cm5PYmplY3Quc3RyZWV0YWRkcmVzcyA9PT0gJ3VuZGVmaW5lZCdcbiAgICApIHtcbiAgICAgIHRoaXMubm90U3RyZWV0TnVtYmVyID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ub3RTdHJlZXROdW1iZXIgPSBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuRGF0YS5wdXNoKHJldHVybk9iamVjdCk7XG4gICAgcmV0dXJuIHJldHVybkRhdGE7XG4gIH1cblxufVxuIl19