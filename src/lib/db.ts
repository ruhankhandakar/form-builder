import { Form } from './types';

const DB_NAME = 'FormBuilderDB';
const STORE_NAME = 'forms';
const DB_VERSION = 1;

export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

export const getFormFromDB = async (): Promise<Form> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get('default');

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      if (request.result) {
        resolve(request.result);
      } else {
        resolve({
          id: 'default',
          title: 'New Form',
          questions: [],
        });
      }
    };
  });
};

export const saveFormToDB = async (form: Form): Promise<Form> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(form);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(form);
  });
};
