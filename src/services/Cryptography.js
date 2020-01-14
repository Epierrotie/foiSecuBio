import FirebaseApi from '@/services/FirebaseApi'

export default {
  encrypt (file) {
    console.log(file)
    let form = new FormData()
    form.append('file', file)
    return FirebaseApi().post('encrypt', {
      data: form
    }, {
      headers: {
        Accept: '*'
      }
    })
  },
  decrypt (file) {
    return FirebaseApi().post('decrypt', {
      'file': file
    }, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}
