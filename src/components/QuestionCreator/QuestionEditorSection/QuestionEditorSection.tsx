import classNames from 'classnames'
import { EditorState } from 'draft-js'
import React, { FC, memo } from 'react'
import { Col, Dropdown, FloatingLabel, Form, Image, Row } from 'react-bootstrap'
import { EditorProps } from 'react-draft-wysiwyg'
import { TQuestion } from '../../../types/types'
import { RICH_TEXT_TOOLBAR, TIMEOUT_OPTIONS } from '../../../utils/constants'
import IconQuestion, { QuestionType } from '../../IconQuestion/IconQuestion'
import QuestionActionButton from '../../QuestionActionButton/QuestionActionButton'
import QuestionConfigBtn from '../../QuestionConfigBtn/QuestionConfigBtn'

const QuestionEditorSection: FC<{
  type: QuestionType
  questionTypeStyles: Record<
    QuestionType,
    {
      icon: string
      colorClassName: string
      title: string
    }
  >
  handleUploadImage: (evt: any) => Promise<void>
  newQuestion: TQuestion
  setNewQuestion: (value: React.SetStateAction<TQuestion>) => void
  isScoreError: boolean
  handleScoreInputChange: (e: any) => void
  setRichTextQuestion: (value: React.SetStateAction<EditorState>) => void
  richTextQuestion: EditorState
  Editor: React.ComponentType<EditorProps>
}> = ({
  type,
  questionTypeStyles,
  handleUploadImage,
  newQuestion,
  setNewQuestion,
  isScoreError,
  handleScoreInputChange,
  setRichTextQuestion,
  richTextQuestion,
  Editor,
}) => {
  return (
    <div className="bg-secondary bg-opacity-10 p-3">
      <Row>
        <Col
          xs="12"
          md="auto"
          className="mb-3 mb-md-0 d-flex flex-column gap-2 flex-md-nowrap"
        >
          <div className="fw-medium fs-22px">Cài đặt</div>

          <QuestionConfigBtn
            prefixIcon={<IconQuestion type={type} />}
            title={
              <div className="fw-medium text-dark">
                {questionTypeStyles[type].title}
              </div>
            }
            suffixIcon=""
          />

          <div className="position-relative">
            <input
              type="file"
              onChange={handleUploadImage}
              className="position-absolute top-0 w-100 h-100 opacity-0 cursor-pointer"
              accept="image/png, image/jpeg, image/jpg"
              style={{ left: 0 }}
            />
            <QuestionConfigBtn
              prefixIcon={
                <QuestionActionButton
                  iconClassName="bi bi-image"
                  className="bg-primary text-white"
                />
              }
              title="Thêm hình ảnh"
              suffixIcon={<i className="bi bi-plus-lg fs-18px" />}
            />
          </div>

          <Dropdown id="timeoutDropdown">
            <Dropdown.Toggle
              id="dropdown-basic"
              className="w-100 p-0 bg-transparent border-0 shadow-none"
            >
              <QuestionConfigBtn
                prefixIcon={
                  <QuestionActionButton
                    iconClassName="bi bi-clock"
                    className="bg-primary text-white"
                  />
                }
                title={`${newQuestion.duration} giây`}
                suffixIcon={<i className="bi bi-chevron-down fs-18px" />}
                className="text-start"
              />
            </Dropdown.Toggle>

            <Dropdown.Menu className="w-100 rounded-10px shadow-sm">
              {TIMEOUT_OPTIONS.map((item, key) => (
                <Dropdown.Item
                  key={key}
                  onClick={() =>
                    setNewQuestion({ ...newQuestion, duration: item })
                  }
                >
                  {item} giây
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <FloatingLabel
            controlId="floatingInput"
            label="Nhập điểm số (0 - 100)"
            className="fs-14px"
          >
            <Form.Control
              type="number"
              placeholder="Nhập điểm số (từ 0 đến 100)"
              className={classNames('rounded-10px border', {
                'border-danger border-2 shadow-none': isScoreError,
              })}
              min={0}
              max={100}
              value={newQuestion?.score}
              onChange={handleScoreInputChange}
            />
          </FloatingLabel>
        </Col>
        <Col className="ps-12px ps-md-0">
          <div className="fw-medium fs-22px mb-2">Soạn câu hỏi</div>

          <Row className="flex-column-reverse flex-md-row border m-0 rounded-10px">
            {newQuestion?.media?.length ? (
              <Col xs="12" md="6" className="p-0">
                <Image
                  src={newQuestion.media}
                  width="100%"
                  height="240"
                  alt=""
                  className="object-fit-cover"
                />
              </Col>
            ) : (
              <></>
            )}
            <Col
              xs="12"
              md={newQuestion?.media?.length ? '6' : '12'}
              className="p-0 bg-white position-relative overflow-hidden"
              style={{ height: 240 }}
            >
              <Editor
                toolbar={RICH_TEXT_TOOLBAR}
                toolbarClassName="position-relative overflow-auto"
                editorState={richTextQuestion}
                defaultEditorState={richTextQuestion}
                wrapperClassName="demo-wrapper bg-white p-0"
                wrapperStyle={{ height: 140 }}
                toolbarStyle={{ height: 100 }}
                editorClassName="demo-editor fs-32px h-100"
                textAlignment={"center"}
                placeholder="Nhập câu hỏi của bạn ở đây..."
                onEditorStateChange={(editorState) => {
                  setRichTextQuestion(editorState)
                }}
              ></Editor>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default memo(QuestionEditorSection)
