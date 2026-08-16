import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgetPassword'
import ProductDetails from './pages/ProductDetails'
import Categories from './pages/Categories'
import CartPage from './pages/CartPage'
import Search from './pages/Search'
import CategoryPage from './pages/CategoryPage'
import UpdateCategory from './pages/admin/categories/UpdateCategory'
import Dashboard from './pages/user/Dashboard'
import Orders from './pages/user/Orders'
import Profile from './pages/user/Profile'
import AdminDashboard from './pages/admin/AdminDashboard'
import CreateCategory from './pages/admin/categories/CreateCategory'
import CreateProduct from './pages/admin/CreateProduct'
import UpdateProducts from './pages/admin/UpdateProducts'
import AdminOrderList from './pages/admin/orders/AdminOrderList'
import CategoryProductList from './pages/admin/CategoryProductList'
import About from './pages/About'
import Policy from './pages/Policy'
import PageNotFound from './pages/PageNotFound'
import Contact from './pages/Contact'
import PrivateRoute from './utilitity/routes/PrivateRoute'
import AdminRoute from './utilitity/routes/AdminRoute'
import OauthSuccess from './pages/oathResponsePage/OauthSuccess';
import OauthFail from './pages/oathResponsePage/OauthFail';
import AdminSpecificationForm from './pages/admin/specifications/AdminSpecificationForm'
import AdminCategoryForm from './pages/admin/categories/AdminCategoryForm'
import AdminCategoryList from './pages/admin/categories/AdminCategoryList'
import AdminSpecificationList from './pages/admin/specifications/AdminSpecificationList'
import AdminLayout from './pages/admin/AdminLayout'
import AdminProductList from './pages/admin/products/AdminProductList'
import AdminProductForm from './pages/admin/products/AdminProductForm'
import AdminProductVariantList from './pages/admin/products/AdminProductVariantList'
import AdminVariantForm from './pages/admin/products/AdminVariantForm'
import AdminProductCustomizations from './pages/admin/products/AdminProductCustomizations'
// import AdminVariantForm from './pages/admin/products/AdminVariant'
// import { Card } from './components/ui/card'
import AdminOrderRefundReview from './pages/admin/orders/AdminOrderRefundReview'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/dashboard" element={<PrivateRoute />}>
            <Route path="user" element={<Dashboard />} />
            <Route path="user/orders" element={<Orders />} />
            <Route path="user/profile" element={<Profile />} />
          </Route>
          <Route path="/dashboard/admin" element={<AdminRoute />}>
            {/* <Route path="" element={<AdminDashboard />} /> */}
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              {/* <Route path="create-category" element={<CreateCategory />} />
              <Route path="category/:id" element={<UpdateCategory />} />
              <Route path="create-product" element={<CreateProduct />} />
              <Route path="product/:slug" element={<UpdateProducts />} />
              <Route path="orders" element={<AdminOrderList />} />
              <Route path="products" element={<CategoryProductList />} /> */}

              <Route path="categories" element={<AdminCategoryList />} />
              <Route path="categories/new" element={<AdminCategoryForm />} />
              <Route path="categories/:id/edit" element={<AdminCategoryForm />} />

              <Route path="specifications" element={<AdminSpecificationList />} />
              <Route path="specifications/new" element={<AdminSpecificationForm />} />
              <Route path="specifications/:id/edit" element={<AdminSpecificationForm />} />

              <Route path="products" element={<AdminProductList />} />
              <Route path="products/new" element={<AdminProductForm />} />
              <Route path="products/:id/edit" element={<AdminProductForm />} />
              <Route path="products/:productId/variants" element={<AdminProductVariantList />} />
              <Route path="products/:productId/variants/new" element={<AdminVariantForm />} />
              <Route path="products/:productId/variants/:variantId/edit" element={<AdminVariantForm />} />

              <Route path="orders" element={<AdminOrderList />} />
              <Route path="orders/:id/refund-review" element={<AdminOrderRefundReview />} />

              <Route
  path="products/:productId/customizations"
  element={<AdminProductCustomizations />}
/>
            </Route>
          </Route>
          <Route path="/oauth" >
            <Route path="success" element={<OauthSuccess />} />
            <Route path="fail" element={<OauthFail />} />
          </Route>
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/policy" element={<Policy />} />

          {/* if any routes not work */}
          <Route path="*" element={<PageNotFound />} />
          {/* <Route path="/cart" element={<Card/>}/> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
