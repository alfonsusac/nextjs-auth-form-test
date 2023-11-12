import { authCookie, jwtsecret } from "./actions"
import * as jose from "jose"

type Session = {
  
}

type AuthFunction = {
  user: Session,

}
