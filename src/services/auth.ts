import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

export class AuthService {

	constructor(private afAuth: AngularFireAuth) {

	}

	/*login(email: string, password: string) {

	}*/

	register(email: string, password: string) {
		return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
	}
}