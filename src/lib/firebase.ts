import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { ComparisonHistoryItem, CustomerProfile } from '../types';
import { MOCK_EXISTING_CUSTOMERS } from '../data/customers';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with specific databaseId provided in config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const COMPARISONS_COLLECTION = 'comparisons';
const CUSTOMERS_COLLECTION = 'customers';

/**
 * Save or update comparison item in Firestore
 */
export async function saveComparisonToFirestore(item: ComparisonHistoryItem): Promise<void> {
  try {
    const docRef = doc(db, COMPARISONS_COLLECTION, item.id);
    await setDoc(docRef, {
      ...item,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    console.error('Error saving comparison to Firestore:', error);
    throw error;
  }
}

/**
 * Toggle mark/pinned status of comparison in Firestore
 */
export async function toggleMarkComparisonInFirestore(id: string, isMarked: boolean): Promise<void> {
  try {
    const docRef = doc(db, COMPARISONS_COLLECTION, id);
    await updateDoc(docRef, {
      isMarked: !isMarked,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error toggling mark in Firestore:', error);
    throw error;
  }
}

/**
 * Delete comparison from Firestore
 */
export async function deleteComparisonFromFirestore(id: string): Promise<void> {
  try {
    const docRef = doc(db, COMPARISONS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting comparison from Firestore:', error);
    throw error;
  }
}

/**
 * Subscribe to real-time updates for saved comparisons
 */
export function subscribeToComparisons(
  onUpdate: (items: ComparisonHistoryItem[]) => void,
  onError?: (err: Error) => void
): () => void {
  try {
    const colRef = collection(db, COMPARISONS_COLLECTION);
    const q = query(colRef, orderBy('createdAt', 'desc'));

    return onSnapshot(
      q,
      (snapshot) => {
        const items: ComparisonHistoryItem[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            createdAt: data.createdAt || new Date().toISOString(),
            formattedDate: data.formattedDate || '',
            customerName: data.customerName || '',
            isMarked: Boolean(data.isMarked),
            selectedPlanIds: Array.isArray(data.selectedPlanIds) ? data.selectedPlanIds : [],
            selectedPlanNames: Array.isArray(data.selectedPlanNames) ? data.selectedPlanNames : [],
            agentFirstName: data.agentFirstName || '',
            agentLastName: data.agentLastName || '',
            agentOfficeCode: data.agentOfficeCode || '',
            agentPhone: data.agentPhone || '',
            userAge: typeof data.userAge === 'number' ? data.userAge : null,
            existingCustomerIdCard: data.existingCustomerIdCard || null,
            notes: data.notes || '',
          };
        });
        onUpdate(items);
      },
      (error) => {
        console.warn('Firestore subscription error (will use local fallback):', error);
        onError?.(error);
      }
    );
  } catch (err) {
    console.warn('Failed to start Firestore listener:', err);
    onError?.(err as Error);
    return () => {};
  }
}

/**
 * Initialize / Seed mock customers into Firestore if empty
 */
export async function seedCustomersToFirestore(): Promise<void> {
  try {
    const colRef = collection(db, CUSTOMERS_COLLECTION);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      const batch = writeBatch(db);
      MOCK_EXISTING_CUSTOMERS.forEach((customer) => {
        const docRef = doc(db, CUSTOMERS_COLLECTION, customer.idCard);
        batch.set(docRef, customer);
      });
      await batch.commit();
      console.log('Successfully seeded initial customers into Firestore');
    }
  } catch (error) {
    console.warn('Unable to seed customers to Firestore (using in-memory mock):', error);
  }
}

/**
 * Subscribe to customers from Firestore
 */
export function subscribeToCustomers(
  onUpdate: (customers: CustomerProfile[]) => void
): () => void {
  try {
    const colRef = collection(db, CUSTOMERS_COLLECTION);
    return onSnapshot(colRef, (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map((d) => d.data() as CustomerProfile);
        onUpdate(list);
      }
    }, (err) => {
      console.warn('Customer subscription fallback to mock:', err);
    });
  } catch (err) {
    return () => {};
  }
}
