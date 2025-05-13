import "./App.css"

import Home from "./resources/home"
import Login from "./resources/user/login"
import LoginAdmin from "./resources/admin/login"
import Reset from "./resources/user/reset"
import Register from "./resources/user/register"

import Cart from "./resources/user/cart"
import ChatVendor from "./resources/user/chat-to-vendor"
import ChatAdmin from "./resources/user/chat-to-admin"
import CheckOut from "./resources/user/checkout"
import OrderedItems from "./resources/user/ordered-items"
import ProductDetails from "./resources/user/product-details"
import RefudnItems from "./resources/user/refund-items"
import ShippedItems from "./resources/user/shipped-items"
import CompletedItems from "./resources/user/completed-items"
import Settings from "./resources/user/settings"
import Test from "./resources/user/test"
import ProtectPath from "./resources/user/protectpath"
import Notification from "./resources/user/notification"


import AdminDashboard from "./resources/admin/dashboard"
import SAdminDashboard from "./resources/superadmin/dashboard"
import AddCategory from "./resources/superadmin/catalog/add-categories"
import AddSubCategory from "./resources/superadmin/catalog/add-subcategories"
import SAdminListUsers from "./resources/superadmin/user/list-users"
import SAdminListVendor from "./resources/superadmin/vendor/list-vendors"
import SAdminNewVendors from "./resources/superadmin/vendor/new-vendors"
import SAdminListAdmins from "./resources/superadmin/admin/list-admins"
import ProtectPathSAdmin from "./resources/superadmin/protectpath"


import VendorDashboard from "./resources/vendor/dashboard"
import LoginVendor from "./resources/vendor/login"
import RegisterVendor from "./resources/vendor/register"
import RestePassword from "./resources/vendor/reset-password"

import ManageProfile from "./resources/vendor/setting/manage-profile"

import UserMessages from "./resources/vendor/message/user-messages"
import AdminMessages from "./resources/vendor/message/admin-messages"
import Notifications from "./resources/vendor/message/notifications"
import ReviewMessages from "./resources/vendor/message/review-messages"
import ProtectPathVendor from "./resources/vendor/protectpath"

import VendorInfo from "./resources/vendor/vendor-info"








import TestOne  from "./resources/superadmin/testone"



import ListUsers from "./resources/admin/user/list-users"
import UserMessagesAdmin from "./resources/admin/user/user-messages"
import AddBanner from "./resources/admin/banner/add-banner"
import UpdatePassword from "./resources/admin/setting/update-password"


import NewVendors from "./resources/admin/vendor/new-vendors"
import ListVendor from "./resources/admin/vendor/list-vendors"
import ManageProducts from "./resources/admin/vendor/manage-products"
import ManageOrders from "./resources/admin/vendor/manage-orders"
import VendorMessages from "./resources/admin/vendor/vendor-messages"
import ApprovePayouts from "./resources/admin/vendor/approve-payout"
import ProtectPathAdmin from "./resources/admin/protectpath"


import AddProduct from "./resources/vendor/product/add-products"
import AddCoupons from "./resources/vendor/product/add-coupons"
import VendorUnderReview from "./resources/vendor/underreview"
import VendorSuspended from "./resources/vendor/suspend"  
import VendorSupport from "./resources/vendor/support"
import VendorStore from "./resources/vendor/VendorStore"


import ControlOrder from "./resources/vendor/order/new-orders"
import CompletedOrders from "./resources/vendor/order/completed"
import Refunds from "./resources/vendor/order/refunds"
import Shipped from "./resources/vendor/order/shipped"

import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>

          <Route path="/superadmin/dashboard" element={<ProtectPathSAdmin Cmp={SAdminDashboard} />} />
          <Route path="/superadmin/add-category" element={<AddCategory />} />
          <Route path="/superadmin/add-subcategory" element={<AddSubCategory />} />
          <Route path="/superadmin/login" element={<LoginAdmin />} />
          <Route path="/superadmin" element={<ProtectPathSAdmin Cmp={SAdminDashboard} />} />
          
          <Route path="/superadmin/list-users" element={<ProtectPathSAdmin Cmp={SAdminListUsers} />}/>
          <Route path="/superadmin/new-Vendors" element={<ProtectPathSAdmin Cmp={SAdminNewVendors} />} />
          <Route path="/superadmin/list-vendors" element={<ProtectPathSAdmin Cmp={SAdminListVendor} />} />
          <Route path="/superadmin/list-admins" element={<ProtectPathSAdmin Cmp={SAdminListAdmins} />} />

          <Route path="/admin/dashboard" element={<ProtectPathAdmin Cmp={AdminDashboard} />}  />
          <Route path="/admin" element={<ProtectPathAdmin Cmp={AdminDashboard} />}  />
          <Route path="/admin/login" element={<LoginAdmin />} />

          <Route path="/admin/list-users" element={<ProtectPathAdmin Cmp={ListUsers} />}/>
          <Route path="/admin/user-messages" element={<ProtectPathAdmin Cmp={UserMessagesAdmin} />} />
          <Route path="/admin/new-Vendors" element={<ProtectPathAdmin Cmp={NewVendors} />} />
          <Route path="/admin/list-vendors" element={<ProtectPathAdmin Cmp={ListVendor} />} />
          <Route path="/admin/manage-products" element={<ProtectPathAdmin Cmp={ManageProducts} />}/>
          <Route path="/admin/manage-orders" element={<ProtectPathAdmin Cmp={ManageOrders} />} />
          <Route path="/admin/approve-payout" element={<ProtectPathAdmin Cmp={ApprovePayouts} />} />
          <Route path="/admin/vendor-messages" element={<ProtectPathAdmin Cmp={VendorMessages} />} />

          <Route path="/admin/banners" element={<ProtectPathAdmin Cmp={AddBanner} />} />
          <Route path="/admin/manage-password" element={<ProtectPathAdmin Cmp={UpdatePassword} />}  />

          <Route path="/superadmin/testone" element={<TestOne  />} />


          <Route path="/vendor/dashboard" element={<ProtectPathVendor Cmp={VendorDashboard} />} />
          <Route path="/vendor" element={<ProtectPathVendor Cmp={VendorDashboard} />}  />
          <Route path="/vendor/login" element={<LoginVendor />} />
          <Route path="/vendor/register" element={<RegisterVendor />} />
          <Route path="/vendor/reset" element={<RestePassword />} />
          <Route path="/vendor/:id" element={<VendorStore />} />

          <Route path="/vendor/manage-profile" element={<ProtectPathVendor Cmp={ManageProfile} />}  />

          <Route path="/vendor/user-messages" element={<ProtectPathVendor Cmp={UserMessages} />}  />
          <Route path="/vendor/admin-messages" element={<ProtectPathVendor Cmp={AdminMessages} />}  />
          <Route path="/vendor/notifications" element={<ProtectPathVendor Cmp={Notifications} />} />
          <Route path="/vendor/review-messages" element={<ProtectPathVendor Cmp={ReviewMessages} />} />
          <Route path="/vendor/add-products" element={<ProtectPathVendor Cmp={AddProduct} />} />
          <Route path="/vendor/add-coupons" element={<ProtectPathVendor Cmp={AddCoupons} />} />

          <Route path="/vendor/underreview/" element={<ProtectPathVendor Cmp={VendorUnderReview} />} />
          <Route path="/vendor/suspend/" element={<ProtectPathVendor Cmp={VendorSuspended} />} />
          <Route path="/vendor/support" element={<ProtectPathVendor Cmp={VendorSupport} />} />


          <Route path="/vendor/new-orders" element={<ProtectPathVendor Cmp={ControlOrder} />} />
          <Route path="/vendor/shipped" element={<ProtectPathVendor Cmp={Shipped} />} />
          <Route path="/vendor/refunds" element={<ProtectPathVendor Cmp={Refunds} />} />
          <Route path="/vendor/completed" element={<ProtectPathVendor Cmp={CompletedOrders} />}/>


          <Route path="/vendor/vendor-info" element={<ProtectPathVendor Cmp={VendorInfo} />} />


          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/reset" element={<Reset />} />

          <Route path="/cart" element={<ProtectPath Cmp={Cart} />} />
          <Route path="/chatvendor" element={<ProtectPath Cmp={ChatVendor} />} />
          <Route path="/helpcenter" element={<ChatAdmin />} />
          <Route path="/checkout" element={<ProtectPath Cmp={CheckOut} />} />
          <Route path="/ordereditems" element={<ProtectPath Cmp={OrderedItems} />} />
          <Route path="/productdetails/:product_id" element={<ProductDetails />} />
          <Route path="/refunditems" element={<ProtectPath Cmp={RefudnItems} />} />
          <Route path="/settings" element={<ProtectPath Cmp={Settings} />} />
          <Route path="/shippeditems" element={<ProtectPath Cmp={ShippedItems} />} />
          <Route path="/completeditems" element={<ProtectPath Cmp={CompletedItems} />} />
          <Route path="/notification" element={<ProtectPath Cmp={Notification} />} />
          <Route path="/test" element={<Test />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
