import classNames from 'classnames'
import _ from 'lodash'
import router from 'next/router'
import React, { FC } from 'react'
import { Form } from 'react-bootstrap'
import MyButton from '../MyButton/MyButton'
import MyInput from '../MyInput/MyInput'

const SearchBar: FC<{
  pageUrl: string
  inputClassName?: string
}> = ({ pageUrl, inputClassName = '' }) => {
  return (
    <Form
      className="d-flex w-100 gap-3"
      onChange={(e: any) => {
        !e?.target?.value?.length && router.replace(`/` + pageUrl)
      }}
      onSubmit={(e) => {
        e.preventDefault()
        router.replace(`/${pageUrl}?q=` + _.get(e, 'target[0].value'))
      }}
    >
      <div className="w-100">
        <MyInput
          name="q"
          className={classNames(inputClassName)}
          placeholder="Tìm kiếm..."
          onClick={(e: any) => e?.target?.select()}
        />
      </div>
      <MyButton
        type="submit"
        className="bi bi-search px-3 text-white"
      ></MyButton>
    </Form>
  )
}

export default SearchBar
