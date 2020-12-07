import Login from './components/auth/Login'
import Register from './components/auth/Register'
import INE from './components/auth/INE'
import ContractPage from './components/auth/Contract'
import HomePage from './components/pages/HomePage'
import HistoryPage from './components/pages/user/HistoryPage'
import TermsPage from './components/auth/TermsPage'
import CompleteProfilePage from './components/auth/CompleteProfilePage'
import ProfilePage from './components/pages/user/ProfilePage'
import OrdersPage from './components/pages/OrdersPage'
import ConfigurationPage from './components/pages/user/ConfigurationPage'


export const routes = {
    //Auth pages

    '/login': {
        component: Login,
    },

    '/register': {
        component: Register,
    },

    '/ine': {
        component: INE,
    },
    
    '/terms': { 
        component: TermsPage,
    },

    '/contract': { 
        component: ContractPage,
    },

    '/complete-profile': { 
        component: CompleteProfilePage,
    },

    //Comun pages

    '/home': {
        component: HomePage,
    },

    '/profile': {
        component: ProfilePage,
    },

    '/history': { 
        component: HistoryPage,
    },

    '/configuration': { 
        component: ConfigurationPage,
    },

    '/orders': { 
        component: OrdersPage,
    },

}