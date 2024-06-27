import { createRouter, createWebHistory } from 'vue-router';

import Dashboard from '@/views/Dashboard.vue';
import AuthenticationPage from '@/views/authentication/AuthenticationPage.vue';
import NotAuthorized from '@/views/NotAuthorized.vue'; // Create a NotAuthorized component for unauthorized access

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/authentication', name: 'Authentication', component: AuthenticationPage },
  { path: '/clients', name: 'Clients Management', component: () => import('@/views/clients_management/ClientsManagement.vue'), meta: { accessArea: 'Clients Management', icon: 'group', label: 'Clients Management' } },
  { path: '/items', name: 'Items Management', component: () => import('@/views/items_management/ItemsManagement.vue'), meta: { accessArea: 'Items Management', icon: 'inventory', label: 'Items Management' } },
  { path: '/coupons', name: 'Coupons Management', component: () => import('@/views/clients_management/CouponsManagement.vue'), meta: { accessArea: 'Coupons Management', icon: 'confirmation_number', label: 'Coupons Management' } },
  { path: '/invoice', name: 'Invoice Management', component: () => import('@/views/invoice_management/InvoiceList.vue'), meta: { accessArea: 'Invoice Management', icon: 'receipt', label: 'Invoice Management' } },
  { path: '/users', name: 'Users Management', component: () => import('@/views/users_management/UsersManagement.vue'), meta: { accessArea: 'Users Management', icon: 'people', label: 'Users Management' } },
  { path: '/invoice/:invoice_no', name: 'Invoice', component: () => import('@/views/invoice_management/Invoice.vue'), meta: { accessArea: 'Invoice Management' } },
  { path: '/logs', name: 'Logs', component: () => import('@/views/Logs.vue'), meta: { accessArea: 'Logs', icon: 'history', label: 'Logs' } },
  { path: '/not-authorized', name: 'NotAuthorized', component: NotAuthorized },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active-navigation'
});

export default router;
