import { QueryDocumentSnapshot, Timestamp } from '@angular/fire/firestore';

export interface Messages {
  id: string;
  senderID: string;
  receiverID: string;
  message: string;
  createdAt: Date;
}
export const messagesConverter = {
  toFirestore: (data: Messages) => ({ ...data }),
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const data = snap.data();
    return {
      ...data,
      createdAt: (data['createdAt'] as Timestamp).toDate(),
    } as Messages;
  },
};
