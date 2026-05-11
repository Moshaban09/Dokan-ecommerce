import { lazy } from 'react';
import { createBrowserRouter, RouterProvider, ScrollRestoration } from 'react-router';
import { MainLayout } from './features/layout';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
import { AuthLayout } from './features/auth/components/AuthLayout';
const HomePage = lazy(() => import('./features/home/pages/HomePage'));
const LoginPage = lazy(() => import('./features/auth/pages/LoginPage'));
const SignupPage = lazy(() => import('./features/auth/pages/SignupPage'));
const ForgotPasswordPage = lazy(() => import('./features/auth/pages/ForgotPasswordPage'));
const ProductsPage = lazy(() => import('./features/products/pages/ProductsPage'));
const ProductDetailsPage = lazy(() => import('./features/products/pages/ProductDetailsPage'));
const CategoryPage = lazy(() => import('./features/products/pages/CategoryPage'));
const SearchResultsPage = lazy(() => import('./features/products/pages/SearchResultsPage'));
const AccountPage = lazy(() => import('./features/account/pages/AccountPage'));
const OrdersPage = lazy(() => import('./features/account/pages/OrdersPage'));
const CancellationsPage = lazy(() => import('./features/account/pages/CancellationsPage'));
const ReviewsPage = lazy(() => import('./features/account/pages/ReviewsPage'));
const CartPage = lazy(() => import('./features/cart/pages/CartPage'));
const WishlistPage = lazy(() => import('./features/wishlist/pages/WishlistPage'));
const CheckoutPage = lazy(() => import('./features/checkout/pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('./features/checkout/pages/OrderSuccessPage'));
const AboutPage = lazy(() => import('./features/misc/pages/AboutPage'));
const ContactPage = lazy(() => import('./features/misc/pages/ContactPage'));
const NotFoundPage = lazy(() => import('./features/misc/pages/NotFoundPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <MainLayout />
        <ScrollRestoration />
      </>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'checkout', element: <CheckoutPage /> },
          { path: 'order-success', element: <OrderSuccessPage /> },
          { path: 'account', element: <AccountPage /> },
          { path: 'orders', element: <OrdersPage /> },
          { path: 'cancellations', element: <CancellationsPage /> },
          { path: 'reviews', element: <ReviewsPage /> },
          { path: 'wishlist', element: <WishlistPage /> },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          { path: 'signup', element: <SignupPage /> },
          { path: 'login', element: <LoginPage /> },
          { path: 'forgot-password', element: <ForgotPasswordPage /> },
        ],
      },
      {
        path: 'contact',
        element: <ContactPage />
      },
      {
        path: 'about',
        element: <AboutPage />
      },
      {
        path: 'product/:id',
        element: <ProductDetailsPage />
      },
      {
        path: 'products',
        element: <ProductsPage />
      },
      {
        path: 'category/:categoryName',
        element: <CategoryPage />
      },
      {
        path: 'search',
        element: <SearchResultsPage />
      },
      {
        path: 'cart',
        element: <CartPage />
      },
      {
        path: '*',
        element: <NotFoundPage />
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
