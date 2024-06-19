import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '@/views/Dashboard.vue'
import AuthenticationPage from '@/views/authentication/AuthenticationPage.vue'

const routes = [
    {path: '/', name: 'Dashboard', component: Dashboard},
    {path: '/authentication', name: 'Authentication', component: AuthenticationPage},
    {path: '/clients', name: 'Clients Management', component: () => import('@/views/clients_management/ClientsManagement.vue')},
    {path: '/items', name: 'Items Management', component: () => import('@/views/items_management/ItemsManagement.vue')},
    {path: '/coupons', name: 'Coupons Management', component: () => import('@/views/clients_management/CouponsManagement.vue')},
    {path: '/invoice', name: 'Invoice Management', component: () => import('@/views/invoice_management/InvoiceList.vue')},
    {path: '/users', name: 'Users Management', component: () => import('@/views/users_management/UsersManagement.vue')},
    {path: '/invoice/:invoice_no', name: 'Invoice', component: () => import('@/views/invoice_management/Invoice.vue')},
    {path: '/logs', name: 'Logs', component: () => import('@/views/Logs.vue')},
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active-navigation'
})

export default router