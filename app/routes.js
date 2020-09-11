import Login from './components/user/Login'
import Register from './components/user/Register'
import HomePage from './components/pages/HomePage'
import ReservationPage from './components/pages/ReservationPage'
import UbicationsPage from './components/pages/UbicationsPage'
import InformationPaymentPage from './components/pages/InformationPaymentPage'
import PaypalPage from './components/pages/PaypalPage'
import QRPage from './components/pages/QRPage'


export const routes = {
    '/login': {
        component: Login,
    },

    '/register': {
        component: Register,
    },

    '/home': {
        component: HomePage,
    },

    '/reservation': {
        component: ReservationPage,
    },

    '/ubications': {
        component: UbicationsPage,
    },

    '/information-payment': {
        component: InformationPaymentPage,
    },

    '/paypal': {
        component: PaypalPage,
    },

    '/qr': {
        component: QRPage,
    }
}