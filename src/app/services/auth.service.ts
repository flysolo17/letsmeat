import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from '@angular/fire/auth';

import {
  Firestore,
  doc,
  getDoc,
  collection,
  limit,
  query,
  where,
  getDocs,
  addDoc,
  orderBy,
} from '@angular/fire/firestore';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { Users, userConverter } from '../models/accounts/User';
import {
  Storage,
  getDownloadURL,
  ref,
  uploadBytes,
} from '@angular/fire/storage';
import { v4 as uuidv4 } from 'uuid';
import { BehaviorSubject, Observable } from 'rxjs';
import { collectionData } from 'rxfire/firestore';
export const USER_COLLECTION = 'Users';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersSubject: BehaviorSubject<Users | null> =
    new BehaviorSubject<Users | null>(null);
  public users$: Observable<Users | null> = this.usersSubject.asObservable();

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private storage: Storage
  ) {}
  setUsers(user: Users): void {
    this.usersSubject.next(user);
  }
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }
  signup(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }
  createUser(users: Users) {
    return addDoc(collection(this.firestore, USER_COLLECTION), users);
  }
  forgotPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }
  getAllStaff(): Observable<Users[]> {
    const q = query(
      collection(this.firestore, USER_COLLECTION),
      orderBy('type', 'asc')
    );
    return collectionData(q) as Observable<Users[]>;
  }
  async uploadProfile(file: File) {
    try {
      const fireRef = ref(this.storage, `${USER_COLLECTION}/${uuidv4()}`);
      await uploadBytes(fireRef, file);
      const downloadURL = await getDownloadURL(fireRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
  async getUserByEmail(email: string): Promise<Users | null> {
    try {
      const q = query(
        collection(this.firestore, USER_COLLECTION),
        where('email', '==', email),
        limit(1)
      ).withConverter(userConverter);

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }
      const userData = querySnapshot.docs[0].data() as Users;
      return userData;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  listenToUser() {
    return authState(this.auth);
  }

  deleteAccount(email: string) {
    //delete account in firebase auth and firestore
  }
  logout() {
    signOut(this.auth);
  }

  async getDriver(driverID: string): Promise<Users | null> {
    try {
      const q = query(
        collection(this.firestore, USER_COLLECTION),
        where('id', '==', driverID),
        limit(1)
      ).withConverter(userConverter);

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }
      const userData = querySnapshot.docs[0].data() as Users;
      return userData;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }
}
