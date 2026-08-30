import Testimonial from '../../models/Testimonial.js'
import { makeAdminCrudRouter } from './adminCrud.factory.js'

export default makeAdminCrudRouter(Testimonial)
