import { QuestionType } from '../components/IconQuestion/IconQuestion'
import { TQuestionType } from '../types/types'

export const API_URL = process.env.NEXT_PUBLIC_API_URL

export const HOME_MENU_OPTIONS = [
  { title: 'Trang chủ', url: '/', iconClassName: 'bi bi-house' },
  {
    title: 'Thư viện của tôi',
    url: '/my-lib',
    iconClassName: 'bi bi-bookmarks',
  },
  { title: 'Khám phá', url: '/explore', iconClassName: 'bi bi-compass' },
  { title: 'Cửa hàng', url: '/items', iconClassName: 'bi bi-shop' },
  { title: 'Nhiệm vụ', url: '/quests', iconClassName: 'bi bi-archive' },
  {
    title: 'Bảng xếp hạng',
    url: '/ranking',
    iconClassName: 'bi bi-bar-chart-line',
  },
]

export const PROFILE_MENU_OPTIONS = [
  { title: 'Chỉnh sửa thông tin', url: '/profile/edit', iconClassName: '' },
  {
    title: 'Đổi mật khẩu',
    url: '/profile/change-password',
    iconClassName: '',
  },
]

export const MAPPED_QUESTION_TYPE: Record<TQuestionType, QuestionType> = {
  '10SG': 'single',
  '20MUL': 'multiple',
  '30TEXT': 'fill',
}

export const MAPPED_QUESTION_MATCHER: Record<string, string> = {
  '10EXC': 'Chính xác',
  '20CNT': 'Chứa đựng',
}

export const TIMEOUT_OPTIONS = [15, 30, 60, 120, 180]

export const RICH_TEXT_TOOLBAR = {}
