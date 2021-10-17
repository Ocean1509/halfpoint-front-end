import defaultSettings from '@/settings'

const title = defaultSettings.title || '半目投资'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
