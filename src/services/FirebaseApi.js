import axios from 'axios'

export default () => {
  return axios.create({
    baseURL: 'https://us-central1-secudubio-46ed5.cloudfunctions.net/'
  })
}
