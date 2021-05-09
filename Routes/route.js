var AuthController=require('../Controllers/AuthController.js')
var home=require('../Controllers/HomeController.js')
const passport = require('passport')
const auth = require('../Controllers/Authentication.js')
const productController = require('../Controllers/ProductController.js')
const cartController = require('../Controllers/CartController.js')
const authController = require('../Controllers/AuthController.js')
const reportController = require('../Controllers/ReportController.js')

var initRoutes = (app)=>{
    //Login Routes
    app.get('/login',auth().isLoggedIn,AuthController().getLogin)
    app.post('/login',auth().isLoggedIn,
    AuthController().postLogin,
    (req,res,next)=>{
        next()
    })
    
    //Registration Routes
    app.get('/register',auth().isLoggedIn,AuthController().getRegister)
    app.post('/register',auth().isLoggedIn,AuthController().postRegister)

    //Logout User
    app.delete('/logout',auth().logout,AuthController().logout)

    //Sending Email
    app.get('/mail',auth().forgot_password,AuthController().getMail)
    app.post('/mail',auth().forgot_password,AuthController().postMail)

    //forgot-password
    app.get('/forgot-password/:token',auth().forgot_password,AuthController().getForgotPassword)
    app.post('/forgot-password/:token',auth().forgot_password,AuthController().postForgotPassword)

    //view Profile


    //Home Route
    app.get('/',home().index)

    //About Route
    app.get('/about',home().about)

    //shop Route
    app.get('/shop',productController().getShop)
    app.post('/shop',productController().postShop)

    app.get('/shop/:id',productController().getShopByCategory)
    
    //Cart Routes
    app.get('/cart',cartController().index)
    app.get('/add-to-cart/:id',cartController().add_to_cart)
    app.post('/update-cart',cartController().update_cart)
    app.get('/delete-cart-product/:id',cartController().delete_cart_product)
    app.get('/delete-cart',cartController().delete_cart)
    
    //check out
    app.get('/checkout',auth().login,productController().getCheckout)
    app.post('/checkout',auth().login,productController().postCheckout)
    
    //Order Routes
    app.get('/orders',productController().getOrder)
    app.post('/payment-completed',productController().paymentCompleted)

    app.get('/placeOrder',productController().placeOrder)
    
    //ADMIN ROUTES
    
    //Product Routes
    app.post('/admin/ManageProduct',auth().isAdmin,productController().postProduct)

    //View Product
    app.get('/admin/ManageProduct/list',auth().isAdmin,productController().getList)

    //Update Product
    app.post('/admin/ManageProduct/:id',auth().isAdmin,productController().postUpdate)
    //Delete Product
    app.get('/admin/ManageProduct/delete/:id',auth().isAdmin,productController().deleteProduct)

    //Order
    app.get('/admin/manageorder',auth().isAdmin,productController().getAdminOrder)

    app.post('/admin/manageorder/status',auth().isAdmin,productController().postOrderStatus)
    app.post('/admin/managepayment/status',auth().isAdmin,productController().postPaymentStatus)


    //Category
    
    app.post('/admin/managecategory',auth().isAdmin,productController().postCategory)
    app.get('/admin/managecategory/list',auth().isAdmin,productController().getCategoryList)
    app.post('/admin/managecategory/:id',auth().isAdmin,productController().postUpdateCategory)
    app.get('/admin/managecategory/delete/:name/:id',auth().isAdmin,productController().deleteCategory)

    //View Customer
    app.get('/admin/viewCustomer',auth().isAdmin,authController().getCustomer)

    //Delivery 
    app.get('/admin/delivery-details/:id',auth().isAdmin,productController().getDelivery)
    app.post('/admin/delivery-details',auth().isAdmin,productController().postDelivery)

    //Reports
    app.get('/admin/reports',auth().isAdmin,reportController().index)
    app.post('/admin/get-reports/:name',auth().isAdmin,reportController().getReports)
}

module.exports = initRoutes