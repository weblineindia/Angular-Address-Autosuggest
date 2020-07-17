(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@fortawesome/free-solid-svg-icons'), require('ngx-google-places-autocomplete'), require('@fortawesome/angular-fontawesome'), require('@angular/forms'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('angular-weblineindia-address', ['exports', '@angular/core', '@fortawesome/free-solid-svg-icons', 'ngx-google-places-autocomplete', '@fortawesome/angular-fontawesome', '@angular/forms', '@angular/common'], factory) :
    (global = global || self, factory(global['angular-weblineindia-address'] = {}, global.ng.core, global.freeSolidSvgIcons, global.ngxGooglePlacesAutocomplete, global.angularFontawesome, global.ng.forms, global.ng.common));
}(this, (function (exports, i0, freeSolidSvgIcons, ngxGooglePlacesAutocomplete, angularFontawesome, forms, common) { 'use strict';

    var AddressService = /** @class */ (function () {
        function AddressService() {
        }
        return AddressService;
    }());
    AddressService.ɵprov = i0.ɵɵdefineInjectable({ factory: function AddressService_Factory() { return new AddressService(); }, token: AddressService, providedIn: "root" });
    AddressService.decorators = [
        { type: i0.Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    AddressService.ctorParameters = function () { return []; };

    var AddressComponent = /** @class */ (function () {
        function AddressComponent() {
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
            this.faPlus = freeSolidSvgIcons.faPlus;
            this.faMinus = freeSolidSvgIcons.faMinus;
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
            this.changeAddress = new i0.EventEmitter();
            this.onPlus = new i0.EventEmitter();
            this.blur = new i0.EventEmitter();
            this.focus = new i0.EventEmitter();
        }
        AddressComponent.prototype.ngOnInit = function () { };
        AddressComponent.prototype.handleAddressChange = function (event, index, addressArray) {
            var place = event;
            if (place.address_components !== undefined) {
                this.selectedAddressArray[index] = this.formatResult(place);
                var dataObj = { data: this.formatResult(place), index: index };
                this.changeAddress.emit(dataObj);
            }
            else {
                this.value = place.name;
                var data = [];
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
                var dataObj = { data: data, index: index };
                this.changeAddress.emit(dataObj);
            }
            this.uniqueAddressValidate(addressArray, index, event);
        };
        AddressComponent.prototype.uniqueAddressValidate = function (addressArray, index, event) {
            addressArray.map(function (item, key) {
                if (key !== index) {
                    if (item.address[0].address === event.formatted_address) {
                        addressArray[index].address[0].isDuplicate = true;
                    }
                }
            });
        };
        AddressComponent.prototype.onBlur = function (event, index) {
            var data = { event: event, index: index };
            this.blur.emit(data);
        };
        AddressComponent.prototype.onFocus = function (event, index) {
            var data = { event: event, index: index };
            this.focus.emit(data);
        };
        AddressComponent.prototype.onPlusClick = function () {
            this.onPlus.emit();
        };
        AddressComponent.prototype.formatResult = function (place) {
            var returnData = [];
            var countryName = '';
            var locality = '';
            var postalCode = '';
            var province = '';
            var streetName = '';
            var streetNumber;
            var state = '';
            for (var i = 0; i < place.address_components.length; i++) {
                var addressType = place.address_components[i].types[0];
                var addressTypeValue = place.address_components[i][this.ADDRESS_COMPONENTS[addressType]];
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
                var geolocation = {
                    x: place.geometry.location.lat(),
                    y: place.geometry.location.lng()
                };
                var commaSeparator = streetNumber ? ', ' : '';
                var space = streetName ? ' ' : '';
                var selectedAddress = '';
                var address = place.formatted_address;
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
        };
        return AddressComponent;
    }());
    AddressComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'lib-address',
                    template: "\n<input\nngx-google-places-autocomplete\n[value]=\"\n  addressValue.fulladdress !== undefined ? addressValue.fulladdress : ''\n\"\n[options]=\"addressOptions\"\n#placesRef=\"ngx-places\"\n(onAddressChange)=\"handleAddressChange($event, index, addressArray)\"\nclass=\"form-control\"\n[placeholder]=\"placeholder\"\n[maxLength]=\"maxlength\"\n[name]=\"name\"\n[id]=\"id\"\n(blur)=\"onBlur($event, index)\"\n(focus)=\"onFocus($event, index)\"\n[disabled]=\"disabled\"\n[tabindex]=tabindex\n/>\n<span *ngIf=\"isMultiple && addressValue !== ''\" class=\"add-remove\">\n<span>\n  <fa-icon [icon]=\"faMinus\"></fa-icon>\n</span>\n<span *ngIf=\"isShowPlus\" class=\"plus-icon\">\n  <fa-icon [icon]=\"faPlus\" (click)=\"onPlusClick()\"></fa-icon>\n</span>\n</span>\n\n<p\n[ngClass]=\"{\n  control: true,\n  'error-msg':\n    addressValue[0].isDuplicate !== undefined\n      ? addressValue[0].isDuplicate\n      : false\n}\"\n*ngIf=\"addressValue !== '' ? addressValue[0].isDuplicate : false\"\n>\n<span>{{addressUniqueErrorMsg}}</span>\n</p>\n",
                    styles: [".form-control{border:1px solid #ccc;box-sizing:border-box;display:inline-block;margin:8px 0;padding:12px 20px;width:50%}p.control.error-msg{color:red}.plus-icon{margin-left:5px}"]
                },] }
    ];
    AddressComponent.propDecorators = {
        isShowStreetField: [{ type: i0.Input }],
        addressValue: [{ type: i0.Input }],
        addressOptions: [{ type: i0.Input }],
        addressArray: [{ type: i0.Input }],
        addressUniqueErrorMsg: [{ type: i0.Input }],
        maxlength: [{ type: i0.Input }],
        name: [{ type: i0.Input }],
        id: [{ type: i0.Input }],
        disabled: [{ type: i0.Input }],
        value: [{ type: i0.Input }],
        isMultiple: [{ type: i0.Input }],
        placeholder: [{ type: i0.Input }],
        isShowPlus: [{ type: i0.Input }],
        tabindex: [{ type: i0.Input }],
        index: [{ type: i0.Input }],
        changeAddress: [{ type: i0.Output }],
        onPlus: [{ type: i0.Output }],
        blur: [{ type: i0.Output }],
        focus: [{ type: i0.Output }]
    };

    var AddressModule = /** @class */ (function () {
        function AddressModule() {
        }
        return AddressModule;
    }());
    AddressModule.decorators = [
        { type: i0.NgModule, args: [{
                    declarations: [AddressComponent],
                    imports: [
                        ngxGooglePlacesAutocomplete.GooglePlaceModule,
                        angularFontawesome.FontAwesomeModule,
                        forms.FormsModule,
                        forms.ReactiveFormsModule,
                        common.CommonModule
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

    exports.AddressComponent = AddressComponent;
    exports.AddressModule = AddressModule;
    exports.AddressService = AddressService;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=angular-weblineindia-address.umd.js.map
