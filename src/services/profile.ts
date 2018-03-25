import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable()
export class ProfileService {


    private usersRef;

    constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) {
        this.afAuth.authState.subscribe(auth => {
            this.usersRef = this.db.list<User>(`users/${auth.uid}`);
        })
    }

    getUser() {
        return this.usersRef;
    }

    editUser(user: User) {
        return this.usersRef.set(user);
    }
}