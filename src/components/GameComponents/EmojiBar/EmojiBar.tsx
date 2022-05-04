import React, { FC } from 'react'
import styles from './EmojiBar.module.css'
import MyButton from '../../MyButton/MyButton'
import classNames from 'classnames'
import MoreButton from '../MoreButton/MoreButton'

const EmojiBar: FC = () => {
  return (
    <div className={styles.emojiBar}>
      {/* "flex-grow-1 d-flex " */}
      <div
        className={classNames(     
          "flex-grow-1",
          styles.emojiPicker          
        )}
      >
        {/* <div className="d-flex gap-2"> */}
          <div className={styles.emojiItem}>
            <div className={styles.emojiImage}></div>
          </div>
          <div className={styles.emojiItem}>
            <div className={styles.emojiImage} />
          </div>
          <div className={styles.emojiItem}>
            <div className={styles.emojiImage} />
          </div>
          <div className={styles.emojiItem}>
            <div className={styles.emojiImage} />
          </div>
          <div className={styles.emojiItem}>
            <div className={styles.emojiImage} />
          </div>

        {/* </div> */}
      </div>
      <div className={styles.separator} />
      <MoreButton
        iconClassName="bi bi-chevron-double-up"
        className={classNames('text-white fw-medium', styles.emojiViewMore)}
        title="Xem thêm"
      >
        Xem thêm
      </MoreButton>
    </div>
  )
}

export default EmojiBar
