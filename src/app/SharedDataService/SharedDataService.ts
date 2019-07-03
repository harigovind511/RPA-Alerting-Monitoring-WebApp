import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

export class UIElementData{
    // Login/Logout button name toggle
    private authButtonname = new BehaviorSubject<string>("Sign In");
    currentAuthButtonname = this.authButtonname.asObservable();

    // Is User Authentication
    private isUserAuthenticated = new BehaviorSubject<boolean>(false);
    currentisUserAuthenticated = this.isUserAuthenticated.asObservable();

    // Method to Update Auth Button Name
    updateAuthButtonName(updateName: string){
        this.authButtonname.next(updateName);
    }

    // Method to Update User Authentication Status
    updateUserAuthenticationStatus(update: boolean){
        this.isUserAuthenticated.next(update);
    }
}