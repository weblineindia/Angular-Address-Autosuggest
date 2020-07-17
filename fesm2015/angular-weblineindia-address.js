import { ɵɵdefineInjectable, Injectable, EventEmitter, Component, Input, Output, NgModule } from '@angular/core';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

class AddressService {
    constructor() { }
}
AddressService.ɵprov = ɵɵdefineInjectable({ factory: function AddressService_Factory() { return new AddressService(); }, token: AddressService, providedIn: "root" });
AddressService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
AddressService.ctorParameters = () => [];

class AddressComponent {
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

class AddressModule {
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

/*
 * Public API Surface of address
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AddressComponent, AddressModule, AddressService };
//# sourceMappingURL=angular-weblineindia-address.js.map
