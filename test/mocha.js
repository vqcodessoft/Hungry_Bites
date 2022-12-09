let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();

const Category = require("../models/category")


chai.use(chaiHttp);


//All test cases
describe('Test API ', () => {

    beforeEach((done) => { 
        Category.deleteOne({}, (err) => { 
           done();           
        });        
    });


    describe("/GET/API/Product", () => {
        //GetAll product
        it("It's should GET all the  Product", (done) => {
            chai.request(app)
                .get("/find-products")
                .end((err, response) => {
                    response.should.have.status(201)
                    response.body.should.be.a('array');
                   // response.body.length.should.be.eql(5);
                    done();
                })
        })


        it("It's should NOT GET all the Product", (done) => {
            chai.request(app)
                .get("/find-product")
                .end((err, response) => {
                    response.should.have.status(404)

                    done();
                })
        })
    })
    //Get particular Product ById
    describe("/GET/API/find-products/:Id", () => {
        it("It's should Get a Product ById", (done) => {
            const productId = "6392bb8e07767d0ee56f296a"
            chai.request(app)
                .get("/find-products/" + productId)
                .end((err, response) => {
                    response.should.have.status(201)
                    // response.body.should.be.a('array');
                    response.body.should.be.a('object');
                    response.body.should.have.property('_id');
                    response.body.should.have.property('name');
                    response.body.should.have.property('Category_type');
                    response.body.should.have.property('address');
                    response.body.should.have.property('phone_no');
                    response.body.should.have.property('cat_id');
                    response.body.should.have.property('status');
                    response.body.should.have.property('sort_order');
                    // response.body.should.have.property('menu_item');
                    response.body.should.have.property('_id');

                    done();
                })
        })

    })
    // Get MenuItem
    describe("/GET/API/MenuItem", () => {
        //GetAll product
        it("It's should GET all the MenuItem", (done) => {
            chai.request(app)
                .get("/find-menuItem")
                .end((err, response) => {
                    response.should.have.status(201)
                    response.body.should.be.a('array');
                    // response.body.length.should.be.eql(6);
                    done();
                })
        })

    })
    //  Get particular MenuItem ById
    describe("/GET/API/MenuItem/:Id", () => {
        it("It's should Get a MenuItem ById", (done) => {
            const menuItemId = "6392be5b07767d0ee56f297e"
            chai.request(app)
                .get("/find-menuItem/" + menuItemId)
                .end((err, response) => {
                    response.should.have.status(201)
                    //  response.body.should.be.a('array');
                    response.body.should.be.a('object');

                    response.body.should.have.property('_id');
                    response.body.should.have.property('product_name');
                    // response.body.should.have.property('Category_type');
                    response.body.should.have.property('description');
                    response.body.should.have.property('price');
                    response.body.should.have.property('product_id');
                    response.body.should.have.property('cat_id');
                    response.body.should.have.property('_id');

                    done();
                })
        })

    })


    //Get Category 
    describe("/GET/API/Category", () => {
        //GetAll product
        it("It's should GET all the Category", (done) => {
            chai.request(app)
                .get("/find-category")
                .end((err, response) => {
                    response.should.have.status(201)
                    response.body.should.be.a('array');
                    // response.body.length.should.be.eql(6);
                    done();
                })
        })

    })

    //post category
    describe("/POST/API/category", () => {
        it("It's should POST a category", (done) => {
            const categories = {
                name: "Hotel",
                status: "active",

            }
            chai.request(app)
                .post("/category")
                .send(categories)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('_id');
                    response.body.should.have.property('name').eq("Hotel");
                    response.body.should.have.property('status').eq("active");


                    done();
                })
        })

    })

    //post MenuItem
    describe("/POST/API/MenuItem", () => {
        it("It's should POST a MenuItem", (done) => {
            
            const menuItem = {
                product_name:"pizza",
                description: "Pizza is a dish of Italian",
                price:"350",
                product_id:"6392bb4307767d0ee56f295f",
                cat_id:"6392eaa31f00c4bd2d111cea"

            }
            chai.request(app)
                .post("/menu_item")
                .send(menuItem)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('_id');
                    response.body.should.have.property('product_name').eq("pizza");
                    response.body.should.have.property('description').eq("Pizza is a dish of Italian");
                    response.body.should.have.property('price').eq("350");
                    response.body.should.have.property('product_id').eq("6392bb4307767d0ee56f295f");
                    response.body.should.have.property('cat_id').eq("6392eaa31f00c4bd2d111cea");


                    done();
                })
        })

    })



    describe("/PUT/API/category", () => {
        it("It's should update password", (done) => {
            const data = {
                admin_id: "6391938c1514bd564f4c7e9a",
                password: "Dua_Salam123",

            }
            chai.request(app)
                .post("/update_password")
                .send(data)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
        
                    done();
                })
        })

        

    })

//Delete Category by ID
    describe("/DELETE/API/category/:id", () => {
        it("It's should ", (done) => {
            const categoryId = "639307f950e1034b17cd604d"
            chai.request(app)
                .delete("/delete_category-with-insideProduct/" + categoryId)
                .end((err, response) => {
                    response.should.have.status(201);
                  
        
                    done();
                })
        })

        

    })

 // Delete Product by ID       
 describe("/DELETE/API/Product/:id", () => {
    it("It's should delete product", (done) => {
        const categoryId = "6392bb4307767d0ee56f295f"
        chai.request(app)
            .delete("/delete_products-category/" + categoryId)
            .end((err, response) => {
                response.should.have.status(201);
              
    
                done();
            })
    })

    

})

// Delete menuItem by ID       
describe("/DELETE/API/menuItem/:id", () => {
    it("It's should delete menuItem", (done) => {
        const categoryId = "6392be5b07767d0ee56f297e"
        chai.request(app)
            .delete("/delete-menuItem/" + categoryId)
            .end((err, response) => {
                response.should.have.status(201);
              
    
                done();
            })
    })

    

})


    //Post Product
    // describe("/POST/API/Product", () => {
    //     it("It's should POST a Product", (done) => {
           
    //         const product = {
    //             name:"pinku123",
    //             username:"pinku123086@gmail.com",
    //             password:"pink123",
    //             type:"admin",
    //             Category_type: "Restaurants",
    //             address:"Punjab",
    //             phone_no:"7549972332",
    //             product_id:"",
    //             cat_id:"6392eaa31f00c4bd2d111cea",
    //             subscription:"free",
    //             status:"active",
    //             sort_order:"4"
    //         }
    //         chai.request(app)
    //             .post("/products")
    //             .send(product)
    //             .end((err, response) => {
    //                 response.should.have.status(201);
    //                 response.body.should.be.a('object');
    //                // response.body.should.have.property('_id');
    //                //response.body.should.have.property('_id');
    //                 response.body.should.have.property('name').eq("pinku123");
    //                 response.body.should.have.property('username').eq("pinku1230@gmail.com");
    //                 response.body.should.have.property('password').eq("pink123");
    //                 response.body.should.have.property('type').eq("admin");
    //                 response.body.should.have.property('Category_type').eq("Restaurants");
    //                 response.body.should.have.property('address').eq("Punjab");
    //                 response.body.should.have.property('phone_no').eq("7549972332");
    //                 response.body.should.have.property('cat_id').eq("6392eaa31f00c4bd2d111cea");
    //                 response.body.should.have.property('subscription').eq("free");
    //                 response.body.should.have.property('status').eq("active");
    //                 response.body.should.have.property('sort_order').eq("4");


    //                 done();
    //             })
    //     })

    // })



})



