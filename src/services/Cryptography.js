import FirebaseApi from '@/services/FirebaseApi'

export default {
  encrypt (file) {
    return FirebaseApi().post('encrypt', {
      'file': file
    }, {
      headers: {
        'Content-Type': 'multipart/form'
      }
    })
  },
  decrypt (file) {
    return FirebaseApi().post('decrypt', {
      'file': file
    }, {
      headers: {
        'Content-Type': 'multipart/from'
      }
    })
  }
}
