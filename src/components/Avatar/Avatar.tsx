import { useRouter } from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import { Dropdown, Image, Spinner } from 'react-bootstrap'
import useSWR from 'swr'
import Cookies from 'universal-cookie'
import { get } from '../../libs/api'
import { TApiResponse, TUser } from '../../types/types'

const Avatar: FC = () => {
  const router = useRouter()
  const cookies = new Cookies()
  const [shouldFetch, setShouldFetch] = useState<boolean>(false)

  const { data, isValidating } = useSWR<TApiResponse<TUser>>(
    shouldFetch ? ['/api/users/profile', true] : null,
    get
  )

  useEffect(() => {
    const accessToken = String(cookies.get('access-token'))
    if (accessToken && accessToken.length && accessToken !== 'undefined') {
      setShouldFetch(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies.get('access-token')])

  const handleLogout = () => {
    cookies.remove('access-token')
    cookies.remove('refresh-token')
    router.push('/sign-in')
  }

  return (
    <Dropdown id="avatar">
      <Dropdown.Toggle className="cursor-pointer p-1 rounded-pill">
        <Image
          src={
            'https://s3-alpha-sig.figma.com/img/6930/d03e/8e80566f92d08cfcbc8d47879b183d48?Expires=1650844800&Signature=MiCqrZeF7D4aLNzKUdw1cQgKxVa~y41C9V5p0Ju98-j4vOZ~n9Y7LKrnRcOXscxY6LFnIyLTs8qeg7zQoN50CQklhwgqKAtM6Tkdc1EjT~XhKjtcQR9~fRO8rbXeVQPD8EzWfJdR8cZsBDN7u7HMY7h2ncrMYFzKr33-oXdrQs8XGlV96zE7hKFE1lhzcmD4fx9piYdXLgB1Tl6f~IngSWakwNC2EuV5fibnD3q0nvE7cpNz0wsOuyegbg4JQgqmWmh4bilbWiHfScNB53oRWN9JtIivSEJb0IGedgdRGy8FbewCQtXRdvsdGAl4AG3oLAaRB5G9B3Q0szzW5-Mxfg__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA'
          }
          width={30}
          height={30}
          alt="avatar"
          className="rounded-circle"
        />

        <span className="text-white ps-2 pe-1 fw-medium">
          {isValidating ? (
            <Spinner animation="border" variant="light" size="sm" />
          ) : (
            data?.response.name || data?.response.username
          )}
        </span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item eventKey="1" onClick={handleLogout}>
          Đăng xuất
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default Avatar
