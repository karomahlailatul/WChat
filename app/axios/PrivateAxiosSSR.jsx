import axios from 'axios'
import jwt_decode from "jwt-decode";
import dayjs from 'dayjs'

import Cookies from "js-cookie";

const baseURL = process.env.REACT_APP_API_BACKEND


const PrivateAxiosSSR = ({token,refreshToken}) => {

    const axiosInstance = axios.create({
        baseURL,
        headers: { Authorization: `Bearer ${token}` }
    });

    let refreshRequest = false;

    axiosInstance.interceptors.request.use(async req => {

        if (token && !refreshRequest) {

            const user = jwt_decode(token);
            const isTokenExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

            if (isTokenExpired) {
                refreshRequest = true
                const response = await axios.post(
                    process.env.REACT_APP_API_BACKEND + "users/refresh-token",
                    { refreshToken: refreshToken }
                    ,
                    {
                        headers: { "Content-Type": "application/json" },
                    },
                    { withCredentials: true }
                );
                
                Cookies.set("token", response.data.data.token);
                Cookies.set("refreshToken", response.data.data.refreshToken);
                req.headers.Authorization = `Bearer ${response.data.data.token}`
            }
        }

        return req
    })

    return axiosInstance
}

export default PrivateAxiosSSR;