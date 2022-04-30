import axios, { ResponseType } from 'axios'
import Cookies from 'universal-cookie'
import { API_URL } from '../utils/constants'

const headers = {
  'Content-Type': 'application/json; charset=UTF-8',
}

const client = axios.create({
  baseURL: API_URL,
  headers,
})

const get = async <T>(
  path: string,
  isAuth: boolean = false,
  params: Record<string, any> = {},
  headers: Record<string, string> = {},
  responseType: ResponseType = 'json'
): Promise<T> => {
  try {
    if (isAuth) {
      const cookies = new Cookies()
      headers['Authorization'] = `Bearer ${cookies.get('access-token')}`
    }

    const resp = await client.get<T>(path, { params, headers, responseType })
    return resp.data
  } catch (error: any) {
    console.log('error.config', error.config)
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log('error.response.data', error.response.data)
      console.log('error.response.status', error.response.status)
      console.log('error.response.headers', error.response.headers)
      throw error.response.data
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message)
    }
    throw error
  }
}

const post = async <T>(
  path: string,
  params: Record<string, any> = {},
  data: Record<string, any> = {},
  isAuth: boolean = false,
  headers: Record<string, string> = {}
): Promise<T> => {
  try {
    if (isAuth) {
      const cookies = new Cookies()
      headers['Authorization'] = `Bearer ${cookies.get('access-token')}`
    }

    const resp = await client.post<T>(path, data, { headers, params })
    return resp.data
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data)
      console.log(error.response?.data?.error?.details)
      console.log(error.response.status)
      console.log(error.response.headers)
      throw error.response.data
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message)
    }
    console.log(error.config)
    throw error.response.data
  }
}

export { get, post }
