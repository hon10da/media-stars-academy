import SiteSettings from '../models/SiteSettings.js'
import { apiSuccess } from '../utils/apiResponse.js'

export async function getPublicSettings(req, res, next) {
  try {
    const settings = await SiteSettings.findOne({ key: 'main' })
    return apiSuccess(res, { data: settings })
  } catch (err) {
    next(err)
  }
}
