import React, { FC } from 'react'
import { Image } from 'react-bootstrap'

const Avatar: FC = () => {
  return (
    <div className="">
      <Image
        src={
          'https://s3-alpha-sig.figma.com/img/6930/d03e/8e80566f92d08cfcbc8d47879b183d48?Expires=1650844800&Signature=MiCqrZeF7D4aLNzKUdw1cQgKxVa~y41C9V5p0Ju98-j4vOZ~n9Y7LKrnRcOXscxY6LFnIyLTs8qeg7zQoN50CQklhwgqKAtM6Tkdc1EjT~XhKjtcQR9~fRO8rbXeVQPD8EzWfJdR8cZsBDN7u7HMY7h2ncrMYFzKr33-oXdrQs8XGlV96zE7hKFE1lhzcmD4fx9piYdXLgB1Tl6f~IngSWakwNC2EuV5fibnD3q0nvE7cpNz0wsOuyegbg4JQgqmWmh4bilbWiHfScNB53oRWN9JtIivSEJb0IGedgdRGy8FbewCQtXRdvsdGAl4AG3oLAaRB5G9B3Q0szzW5-Mxfg__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA'
        }
        width={40}
        height={40}
        alt="avatar"
        className="rounded-circle"
      />
    </div>
  )
}

export default Avatar
