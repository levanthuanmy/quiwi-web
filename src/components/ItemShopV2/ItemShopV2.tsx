import { FC, useState } from 'react'
import { Button, Image, Modal } from 'react-bootstrap'
import { useSound } from '../../hooks/useSound/useSound'
import { get } from '../../libs/api'
import { TItem } from '../../types/types'
import { SOUND_EFFECT } from '../../utils/constants'
import { ItemPurchaseModal } from '../ItemPurchaseModal/ItemPurchaseModal'
import MyModal from '../MyModal/MyModal'
import styles from './ItemShopV2.module.css'

type ItemShopProps = {
  item: TItem
  userBuyItem: VoidFunction
}

type ItemType = 'RARE' | 'EPIC' | 'LEGENDARY' | 'COMMON'

const ItemShopV2: FC<ItemShopProps> = ({ item, userBuyItem }) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [showAlertModal, setShowAlertModal] = useState(false)
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const sound = useSound()

  const buyItem = async () => {
    sound?.playSound(SOUND_EFFECT['CONFIRM_BUY_BUTTON_SOUND_CLICK'])
    setShowConfirmationModal(false)
    try {
      const params = {
        quantity,
      }
      await get(`/api/items/buy/${item.id}`, true, params)
      userBuyItem()
    } catch (error) {
      setError((error as Error).message)
    }
    setShowAlertModal(true)
    setQuantity(1)
  }

  const mappedItemTypeWithColor: Record<ItemType, string> = {
    RARE: 'purple',
    EPIC: 'orange',
    LEGENDARY: 'orangered',
    COMMON: 'gray',
  }

  return (
    <div className={styles.card}>
      <div className={styles.card__thumb}>
        <Image loading="lazy" alt="item-avatar" src={item.avatar} />
      </div>
      <div className={styles.card__body}>
        <div className={styles.card__category}>{item.itemCategory.name}</div>
        <h6 className={styles.card__title}>{item.name}</h6>
        <span
          style={{
            backgroundColor: mappedItemTypeWithColor[item.type as ItemType],
          }}
          className="px-2 py-1 rounded-pill text-white fs-14px fw-medium"
        >
          {item.type}
        </span>
        <div className={styles.card__subtitle}>
          <Image
            alt="coin"
            src="/assets/quiwi-coin.png"
            width="20"
            height="20"
          />
          <div className={styles.price}>{item.price}</div>
        </div>
        <p className={styles.card__description}>{item.description}</p>
      </div>

      <footer className={styles.card__footer}>
        {item.itemCategory?.name !== 'Đạo cụ' && item.isOwn ? (
          <div className="text-primary fs-14px">Đã sở hữu</div>
        ) : (
          <Button
            className={styles.btnBuy}
            onClick={() => {
              sound.playSound(SOUND_EFFECT['BUY_BUTTON_SOUND_CLICK'])
              setShowConfirmationModal(true)
            }}
          >
            MUA NGAY
          </Button>
        )}
      </footer>

      <ItemPurchaseModal
        onHide={() => {
          setError('')
          setQuantity(1)
          setShowConfirmationModal(false)
        }}
        buyItem={buyItem}
        quantity={quantity}
        setQuantity={setQuantity}
        showModal={showConfirmationModal}
        key={item.id}
        item={item}
      />

      <MyModal
        show={showAlertModal}
        onHide={() => {
          setError('')
          setQuantity(1)
          setShowAlertModal(false)
        }}
        activeButtonTitle="Đồng ý"
        activeButtonCallback={() => {
          setError('')
          setShowAlertModal(false)
          setQuantity(1)
        }}
        size="sm"
        header={
          <Modal.Title
            className={error.length > 0 ? 'text-danger' : 'text-primary'}
          >
            Thông báo
          </Modal.Title>
        }
      >
        <div>
          {error.length > 0
            ? error
            : `Mua hàng thành công vật phẩm ${item.name}!`}
        </div>
      </MyModal>
    </div>
  )
}

export default ItemShopV2
