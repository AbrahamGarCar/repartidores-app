import Login from './components/user/Login'
import Register from './components/user/Register'
import HomePage from './components/pages/HomePage'
import ReservationPage from './components/pages/ReservationPage'
import UbicationsPage from './components/pages/UbicationsPage'
import InformationPaymentPage from './components/pages/InformationPaymentPage'
import PaypalPage from './components/pages/PaypalPage'
import QRPage from './components/pages/QRPage'
import ActiveReservationPage from './components/user/ActiveReservationPage'
import HistoryPage from './components/user/HistoryPage'
import PanicButtonPage from './components/pages/PanicButtonPage'
import PanicButton2Page from './components/pages/PanicButton2Page'
import TermsPage from './components/user/TermsPage'
import ScanPage from './components/pages/guard/ScanPage'
import CompleteProfilePage from './components/user/CompleteProfilePage'


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
    },

    '/active-reservation': { 
        component: ActiveReservationPage,
    },

    '/history': { 
        component: HistoryPage,
    },

    '/panic-button': { 
        component: PanicButtonPage,
    },

    '/panic-button-2': { 
        component: PanicButton2Page,
    },

    '/terms': { 
        component: TermsPage,
    },

    '/scaner': { 
        component: ScanPage,
    },

    '/complete-profile': { 
        component: CompleteProfilePage,
    }
}