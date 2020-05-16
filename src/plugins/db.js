import firebase from 'firebase/app'
import 'firebase/firestore'
import configFirebase from '../../config/firebase';

// Get a Firestore instance
export const db = firebase
  .initializeApp(configFirebase)
  .firestore()

// Export types that exists in Firestore
// This is not always necessary, but it's used in other examples
const { Timestamp, GeoPoint } = firebase.firestore
export { Timestamp, GeoPoint }
