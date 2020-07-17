import { EventEmitter } from '@angular/core';
export declare class AddressComponent {
    ADDRESS_COMPONENTS: any;
    faPlus: any;
    faMinus: any;
    notStreetNumber: Boolean;
    streetNumber: String;
    selectedAddressArray: any;
    isShowStreetField: Boolean;
    addressValue: any;
    addressOptions: any;
    addressArray: any;
    addressUniqueErrorMsg: String;
    maxlength: Number;
    name: String;
    id: String;
    disabled: Boolean;
    value: String;
    isMultiple: Boolean;
    placeholder: String;
    isShowPlus: Boolean;
    tabindex: Number;
    index: Number;
    changeAddress: EventEmitter<any>;
    onPlus: EventEmitter<any>;
    blur: EventEmitter<any>;
    focus: EventEmitter<any>;
    ngOnInit(): void;
    handleAddressChange(event: any, index: any, addressArray: any): void;
    uniqueAddressValidate(addressArray: any, index: any, event: any): void;
    onBlur(event: any, index: any): void;
    onFocus(event: any, index: any): void;
    onPlusClick(): void;
    formatResult(place: any): any[];
}
