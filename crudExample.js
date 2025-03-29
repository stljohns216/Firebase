// Import the Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Create: Add a new document
async function createData() {
    try {
        const docRef = await addDoc(collection(db, "users"), {
            name: "Steve Johnson",
            email: "sjohnson@istm622.com",
            age: 32
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

// Read: Get all documents
async function readData() {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => `, doc.data());
    });
}

// Update: Update a specific document
async function updateData(docId) {
    const docRef = doc(db, "users", docId);
    try {
        await updateDoc(docRef, {
            age: 31
        });
        console.log("Document updated");
    } catch (e) {
        console.error("Error updating document: ", e);
    }
}

// Delete: Delete a specific document
async function deleteData(docId) {
    const docRef = doc(db, "users", docId);
    try {
        await deleteDoc(docRef);
        console.log("Document deleted");
    } catch (e) {
        console.error("Error deleting document: ", e);
    }
}

// Example usage
// createData();
// readData();
// updateData("DOCUMENT_ID");
// deleteData("DOCUMENT_ID");
