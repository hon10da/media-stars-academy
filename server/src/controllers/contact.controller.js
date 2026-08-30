import Registration from '../models/Registration.js'
import ContactMessage from '../models/ContactMessage.js'
import { apiSuccess } from '../utils/apiResponse.js'

export async function createRegistration(req, res, next) {
  try {
    const registration = await Registration.create(req.body)
    return apiSuccess(res, {
      data: registration,
      message: 'تم استلام طلب التسجيل بنجاح، سيتواصل معك فريقنا قريبًا.',
      status: 201,
    })
  } catch (err) {
    next(err)
  }
}

export async function createContactMessage(req, res, next) {
  try {
    const contactMessage = await ContactMessage.create(req.body)
    return apiSuccess(res, {
      data: contactMessage,
      message: 'تم إرسال رسالتك بنجاح، سنرد عليك في أقرب وقت.',
      status: 201,
    })
  } catch (err) {
    next(err)
  }
}
