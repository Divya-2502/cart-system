var usersdata;
var productcount;
var price;
var addtocarproducts;
var removeButton = document.querySelectorAll(".remove_button");
var clearButton = document.querySelector(".clear_cart_count");
var total;
var cartcount;
let mainContent = document.getElementById("Ecommerce_products");
let skeleton = document.getElementById("skeletonLoading");

if(mainContent){
    let skeletonHTML = "";

    for (let i = 0; i < 6; i++) {
        skeletonHTML += `
            <div class="col-sm-6 col-md-6 col-lg-4">
                <div class="inner_listing_page skeleton-card">
                    <div class="skeleton-image"></div>
                    <div class="skeleton-text"></div>
                    <div class="skeleton-text short"></div>
                    <div class="skeleton-text price"></div>
                </div>
            </div>
        `;
    }

    skeleton.innerHTML = skeletonHTML;
}
fetch("https://dummyjson.com/products")
   .then(res => res.json())
   .then(data =>{

    
    let detailContent = document.getElementById("detail_product");
    addtocarproducts = document.getElementById("add_tocart_products");
    usersdata = data.products;
    if(mainContent){
       mainContent.innerHTML = "";
        usersdata.forEach(item => {
            mainContent.innerHTML += `
            <div class="col-sm-6 col-md-6 col-lg-4 col listing_products">
                <div class="inner_listing_page">
                    <div class="thumb_image">
                      <img src="${item.thumbnail}" alt="${item.title}" onClick = 'productdetail(${item.id})' class="img-fluid"/>
                    </div>
                    <div>
                        <h5>${item.title}</h5>
                        <p class="des_text">${item.description}</div>
                        <h4>$ ${item.price}</h4>
                    </div>
                </div>
            </div>`
        
         });
        setTimeout(() => {
            skeleton.classList.add("d_none");
            mainContent.classList.remove("d_none");
        }, 3000);
        
        
    }
    
    
    if(detailContent){
        let dataId = localStorage.getItem("SelectedId");
        if(dataId){
        let productdetailsingle = data.products.find(p => p.id == dataId);
            if(productdetailsingle){
                detailContent.innerHTML = `
                    <div class="detail_page_div row">
                        <div class="product_detail_image col-lg-7 col-md-7 col-12">
                            <img src="${productdetailsingle.images}" width="650" height="650" class="img-fluid"/>
                        </div>
                        <div class="col-lg-5 col-md-5 col-12 ps-lg-5 mt-5 mt-md-0">
                            <h2>${productdetailsingle.title}</h2>
                            <h3>$ ${productdetailsingle.price}</h3>
                            <p>${productdetailsingle.warrantyInformation}</p>
                            <p>${productdetailsingle.shippingInformation}</p>
                            <p>${productdetailsingle.availabilityStatus}</p>
                            <p>${productdetailsingle.returnPolicy}</p>
                            <p>${productdetailsingle.description}</p>
                            <div>
                                <button class="add_to_cart_btn" onClick="addtocart(${productdetailsingle.id})">ADD TO CART</button>
                            </div>
                        </div>
                    </div>

                    `
            }
        }
    }

    if(window.location.pathname.includes("add_to_cart.html")){
        debugger
        
        if(localStorage.getItem("Fromaddtocart") == "true"){
            addtocartfun();
        }
        localStorage.removeItem("Fromaddtocart");
        cartRender();
        
    }
   
})

function productdetail(product){
    localStorage.setItem("SelectedId", product);
    window.location.href = "cart.html";
   
}
function addtocart(cartProduct){
    debugger


    localStorage.setItem("addtocardID", cartProduct);
    
    let path = window.location.pathname;
    // console.log(path);
    localStorage.setItem("Fromaddtocart", "true");
    let fromaddtocart = localStorage.getItem("Fromaddtocart");
    console.log(fromaddtocart);

    // if(fromaddtocart){
        debugger
        let selectedcartId = localStorage.getItem("addtocardID");
        if(selectedcartId){
            let cartproducts = usersdata.find(p =>p.id == selectedcartId);
            if(cartproducts){
                price = cartproducts.price;
                // console.log(price)
                localStorage.setItem("cartproductsId",cartproducts.id);
                window.location.href = "add_to_cart.html";
             }
        }
    // }


    
}
function decreasefun(index){
    let carts = JSON.parse(localStorage.getItem("cart_data"));
    // productcount  = document.querySelector(".productcount").innerText;

    // let cartCountint = parseInt(productcount);
    if(carts[index].quantity > 1){
        carts[index].quantity--;
    }
    // document.querySelector(".productcount").innerText = cartCountint;
    localStorage.setItem("cart_data", JSON.stringify(carts));
    // console.log(carts)
    location.reload();
}
function increasefun(index){
    debugger
    
    let carts = JSON.parse(localStorage.getItem("cart_data"));
    // productcount  = document.querySelector(".productcount").innerText;
    // let cartCountint = parseInt(productcount);
    carts[index].quantity++;
    // document.querySelector(".productcount").innerText = cartCountint;
    localStorage.setItem("cart_data", JSON.stringify(carts));
    // console.log(carts)
     location.reload();
}


function addtocartfun(){
    debugger

    if(window.location.pathname.includes("add_to_cart.html")){
    
        let carts = JSON.parse(localStorage.getItem("cart_data") || "[]");

        
       
        
        let cartProductId = localStorage.getItem("cartproductsId");
        let existing = carts.find(item => item.id == cartProductId);
        let product = usersdata.find(item => item.id == cartProductId);
        // console.log(product);
        if(existing){
            existing.quantity += 1
        }
        else{
            carts.push({
                id:product.id,
                title: product.title,
                price: product.price,
                thumbnail: product.thumbnail,
                quantity: 1
            })
        }
        localStorage.setItem("cart_data", JSON.stringify(carts));
        // console.log(addtocarproducts);
        // emptycart()
    }
}

function cartRender(){
    let carts = JSON.parse(localStorage.getItem("cart_data") || "[]");
    var subtotal = 0;
    carts.forEach((item, index) => {
        addtocarproducts.innerHTML +=   `
                        <div class="carteachproduct row">
                            <div class="col-sm-6">
                                <img src="${item.thumbnail}" class="img-fluid"/>
                            </div>
                            <div class="cart_description col-sm-6">
                                <p>${item.title}</p>
                                <p>$ ${item.price}</p>
                                <p><span class="decreasecart" onClick="decreasefun(${index})">- </span><span class="productcount">${item.quantity}</span><span onClick="increasefun(${index})" class="increasecart"> +</span></p>
                                <button class="remove_button" onClick="removecart(${index})">Remove Item</button>
                            </div>
                        </div>
        `
        
        
        subtotal += item.price * item.quantity;
        
    });
    localStorage.setItem("cartCount", cartcount);
    cartcount = localStorage.getItem("cartCount");
    console.log(subtotal);
    updatecartcount();
// document.querySelectorAll(".cart_count").forEach(el => {
//     el.textContent = cartcount;
// });
document.getElementById("subTotal").textContent = "$" + subtotal.toFixed(2);
document.getElementById("total").textContent = "$" + (subtotal + 80).toFixed(2);


if(cartcount == 0){
    document.querySelector(".empty_cart").classList.remove("d_none");
    document.querySelector(".products_amount").classList.add("d_none");
}
else{
    document.querySelector(".empty_cart").classList.add("d_none");
    document.querySelector(".products_amount").classList.remove("d_none");
}
}
        


function removecart(index){
    debugger
    let carts = JSON.parse(localStorage.getItem("cart_data") || "[]");
    let updatedremovedcart = carts.filter((item, i) => i !== index);
    localStorage.setItem("cart_data", JSON.stringify(updatedremovedcart));
    location.reload();
    // emptycart()
}

clearButton?.addEventListener('click', function(){
    debugger
    localStorage.removeItem("cart_data");
    addtocarproducts.innerHTML = "";
    document.querySelector(".cart_count").textContent = 0;
    document.querySelector(".empty_cart").classList.remove("d_none");
    document.querySelector(".products_amount").classList.add("d_none");
    updatecartcount();
});
function updatecartcount(){
    debugger
    let carts = JSON.parse(localStorage.getItem("cart_data") || "[]");
    cartcount = 0;
    carts.forEach(item => {
        cartcount += item.quantity;
    })
    document.querySelectorAll(".cart_count").forEach(el => {
        el.textContent = cartcount;
    });
    if(!cartcount){
        clearButton.classList.add("d_none");
    }
    else{
        clearButton.classList.remove("d_none");
    }
}

updatecartcount();

// function emptycart(){
//     if(document.querySelector(".cart_count").textContent === "0"){
//         document.querySelector(".empty_cart").classList.add("d_none");
//     }
//     else{
//         document.querySelector(".empty_cart").classList.remove("d_none");
//     }
// }




