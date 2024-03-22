
import { jwtDecode } from "jwt-decode";
import moment from "moment/moment";
export const useDecodeJwt = (token) => {
        const claims = jwtDecode(token)
        return claims;
      
}
export const tokenExpired = (token) => {
    const decoded = jwtDecode(token);
    const exp_date = new Date(decoded.exp * 1000);
    const currentDate = Date.now();
    const tokenExpired = moment(currentDate).isAfter(exp_date) ?? false;
    return tokenExpired
}

                                                                                                     