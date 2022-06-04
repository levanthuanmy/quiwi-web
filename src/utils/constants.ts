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
  {
    title: 'Lịch sử tham gia',
    url: '/history',
    iconClassName: 'bi bi-clipboard2-data',
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

export const GAME_MODE_MAPPING: Record<string, string> = {
  '10CLASSIC': 'Truyền Thống',
  '20MRT': 'Marathon',
}

export const MAPPED_QUESTION_TYPE: Record<TQuestionType, QuestionType> = {
  '10SG': 'single',
  '20MUL': 'multiple',
  '30TEXT': 'fill',
}

export const MAPPED_QUESTION_MATCHER: Record<string, string> = {
  '10EXC': 'Chính xác',
  '20CNT': 'Chứa đựng',
}

export const SOUND_EFFECT: Record<string, string> = {
  'SIDE_BAR_SOUND_CLICK': 'http://freesoundeffect.net/sites/default/files/orangejuicejug-684-sound-effect-70773316.mp3',
  'BUY_BUTTON_SOUND_CLICK': 'http://freesoundeffect.net/sites/default/files/orangejuicejug-684-sound-effect-70773316.mp3',
  'INCREASE_QUANTITY_BUTTON_SOUND_CLICK': 'http://freesoundeffect.net/sites/default/files/orangejuicejug-684-sound-effect-70773316.mp3',
  'CONFIRM_BUY_BUTTON_SOUND_CLICK': 'http://freesoundeffect.net/sites/default/files/gold-prize-04-sound-effect-61322022.mp3'
}

export const TIMEOUT_OPTIONS = [15, 30, 60, 120, 180]

export const RICH_TEXT_TOOLBAR = {}

export const ANSWER_COLORS: Array<string> = ['#00a991', '#e2352a', '#f67702', '#0082BE', "#facc50", "#773172"]
