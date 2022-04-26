export const API_URL = process.env.NEXT_PUBLIC_API_URL

export const homeMenuOptions = [
  { title: 'Trang chủ', url: '/', iconClassName: 'bi bi-house' },
  {
    title: 'Thư viện của tôi',
    url: '/my-lib',
    iconClassName: 'bi bi-bookmarks',
  },
  { title: 'Khám phá', url: '/ex', iconClassName: 'bi bi-compass' },
]

export const profileMenuOptions = [
  { title: 'Chỉnh sửa thông tin', url: '/profile/edit', iconClassName: '' },
  {
    title: 'Đổi mật khẩu',
    url: '/profile/change-password',
    iconClassName: '',
  },
]
