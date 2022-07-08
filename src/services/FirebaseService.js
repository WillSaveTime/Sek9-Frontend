import {
  auth,
  googleAuthProvider,
  facebookAuthProvider,
  db,
  storage
} from 'auth/FirebaseAuth'
import {
  ref,
  onValue,
  push,
  update,
  startAfter,
  limitToLast,
  endAt,
  endBefore,
  remove,
  startAt,
  query,
  orderByKey,
  limitToFirst
} from 'firebase/database'
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage'

const FirebaseService = {}

FirebaseService.signInEmailRequest = async (email, password) =>
  await signInWithEmailAndPassword(auth, email, password)
    .then(user => user)
    .catch(err => err)

FirebaseService.signOutRequest = async () =>
  await signOut(auth)
    .then(user => user)
    .catch(err => err)

FirebaseService.signInGoogleRequest = async () =>
  await signInWithPopup(auth, googleAuthProvider)
    .then(user => user)
    .catch(err => err)

FirebaseService.signInFacebookRequest = async () =>
  await signInWithPopup(auth, facebookAuthProvider)
    .then(user => user)
    .catch(err => err)

FirebaseService.signUpEmailRequest = async (email, password) =>
  await createUserWithEmailAndPassword(email, password)
    .then(user => user)
    .catch(err => err)

FirebaseService.getCategories = (callback, orderKey, start, end, count) => {
  const catRef = ref(db, 'categories')
  let queryRef = query(catRef)
  if (orderKey) {
    queryRef = query(catRef, orderByKey(orderKey), limitToFirst(4))
  }
  // if(count){
  //   queryRef = query(catRef,orderByKey('objectId'), limitToFirst(count));
  // }
  // if(start){
  //   queryRef = query(catRef,orderByKey('objectId'), startAfter(start), limitToFirst(count));
  // }

  // if(end){
  //   queryRef = query(catRef,orderByKey('objectId'), endBefore(end), limitToLast(count));
  // }

  onValue(queryRef, snapshot => {
    const data = snapshot.val()
    console.log('data===', data)
    // Convert object data to list
    if (!data) return []
    const cats = JSON.parse(JSON.stringify(data))
    const newCats = Object.keys(cats).map((key, index) => {
      const cat = cats[key]
      let newCat = {
        id: index,
        ...cat,
        strTags: cat.tags ? cat.tags.join(', ') : ''
      }
      return newCat
    })
    if (callback) callback(newCats)
  })
}

FirebaseService.addCategory = data => {
  const catRef = ref(db, 'categories')
  const newCat = push(catRef)
  const newKey = newCat.key
  let updates = {}
  let updatedData = { ...data, objectId: newKey }
  updates[newKey] = updatedData
  const res = update(catRef, updates)
  return res
}

FirebaseService.deleteCategory = data => {
  const catRef = ref(db, `categories/${data.objectId}`)
  const res = remove(catRef)
  return res
}

FirebaseService.updateCategory = data => {
  const catRef = ref(db, `categories/${data.objectId}`)
  const res = update(catRef, data)
  return res
}

FirebaseService.getEthereums = (category, start, count, callback = null) => {
  const ethRef = ref(db, `domains/eth/${category}`)
  // const queryRef = query(ethRef, startAt(start), endAt(start + count))
  let queryRef = query(ethRef)
  if (count) {
    queryRef = query(ethRef, orderByKey('objectId'), limitToFirst(count))
  }
  // if(count){
  //   queryRef = query(catRef,orderByKey('objectId'), limitToFirst(count));
  // }
  // if(start){
  //   queryRef = query(catRef,orderByKey('objectId'), startAfter(start), limitToFirst(count));
  // }

  // if(end){
  //   queryRef = query(catRef,orderByKey('objectId'), endBefore(end), limitToLast(count));
  // }
  onValue(queryRef, snapshot => {
    const data = snapshot.val()
    console.log('==== getEthereums: ', data)
    // Convert object data to list
    let arrayData = []
    if (data) {
      const jsonData = JSON.parse(JSON.stringify(data))
      arrayData = Object.keys(jsonData).map((key, index) => {
        return {
          id: index,
          ...jsonData[key]
        }
      })
    }
    console.log('==== arrayData: ', arrayData)
    if (callback) callback(arrayData)
  })
}

FirebaseService.addEthereum = data => {
  const catRef = ref(db, 'categories')
  const newCat = push(catRef)
  const newKey = newCat.key
  let updates = {}
  let updatedData = { ...data, objectId: newKey }
  updates[newKey] = updatedData
  const res = update(catRef, updates)
  return res
}

FirebaseService.uploadFile = async (name, file, metadata) => {
  const imageRef = storageRef(storage, '/assets/imgs/clubs/' + name)
  // 'file' comes from the Blob or File API
  const snapshot = await uploadBytes(imageRef, file, metadata)
  console.log('Uploaded a blob or file!', snapshot)
  const imageUrl = getDownloadURL(imageRef)
  return imageUrl
}

FirebaseService.uploadCsvFile = async (category, name, file, metadata) => {
  const imageRef = storageRef(
    storage,
    `/assets/categories/${category}/list_file/${name}`
  )
  // 'file' comes from the Blob or File API
  const snapshot = await uploadBytes(imageRef, file, metadata)
  console.log('Uploaded a blob or file!', snapshot)
  const imageUrl = getDownloadURL(imageRef)
  return imageUrl
}

export default FirebaseService
