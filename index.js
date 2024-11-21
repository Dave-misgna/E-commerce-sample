const iconCart = document.getElementById('the_cart');
const cart_tab = document.getElementsByClassName('carttab')[0];
const close = document.getElementsByClassName('close')[0];
let listProductHTML = document.getElementsByClassName('product_list')[0];
let listCartHTML = document.getElementsByClassName('listcart')[0];
let iconCartSpan = document.querySelector('span');


let listProduct = [];
let carts = [];



iconCart.addEventListener('click', () => {
    cart_tab.classList.toggle('showcart'); 
})

close.addEventListener('click', () => {
    cart_tab.classList.remove('showcart'); 
})

const addToHTML = () =>{
    listProductHTML.innerHTML = ''; // Clear previous content
    if(listProduct.length>0){
        listProduct.forEach(product=>{
            let newProduct = document.createElement('div');
            newProduct.classList.add('items');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
            <img src="${product.image}" alt="img">
            <h3>${product.name}</h3>
            <div class="price">
              ${product.price}
            </div>
            <button class="button" >Add to cart</button>
            `
            listProductHTML.appendChild(newProduct);

            
        })
    }
}

listProductHTML.addEventListener("click", (event)=>{
    let positionclicked = event.target;
    if(positionclicked.classList.contains('button')){
        let product_id = positionclicked.parentElement.dataset.id
        addToCart(product_id);
    }
})

const addToCart= (product_id) =>{
    let positionThisProductInCart = carts.findIndex((value)=> value.product_id == product_id);
    if(carts.length <=0){
        carts = [{
            product_id: product_id,
            quantity: 1
        }]
    }else if(positionThisProductInCart < 0){
        carts.push({
            product_id: product_id,
            quantity: 1
        });

    }else{
        carts[positionThisProductInCart].quantity = carts[positionThisProductInCart].quantity +1;
    }
    addCartToHTML();
    addCartToMemory();

}
const addCartToMemory = ()=>{
    localStorage.setItem('cart', JSON.stringify(carts));
}

const addCartToHTML = ()=>{
    listCartHTML.innerHTML = '';
    totalQuantity = 0;
    if(carts.length>0){
        carts.forEach(item => {
            let product = listProduct.findIndex((value) => value.id == item.product_id);
            let info = listProduct[product];
            totalQuantity = totalQuantity + item.quantity;
            let newProduct = document.createElement('div');
            newProduct.classList.add('items');
            newProduct.dataset.id = item.product_id;
            newProduct.innerHTML = `
        <img src="${info.image}" alt="img">
        ${info.name}
        <div class="price">
          $${parseFloat(info.price.replace('$', '')) * item.quantity }
        </div>
        <div class="quantity">
            <span class="minus"><</span>
            <span>${item.quantity}</span>
            <span class="plus">></span>
        </div>
        
        `
            listCartHTML.appendChild(newProduct);
        })
       

    }
    iconCartSpan.innerText = totalQuantity;
    
}

listCartHTML.addEventListener('click', (event)=>{
    let positioncheck = event.target;
    if(positioncheck.classList.contains('minus') || positioncheck.classList.contains('plus')){
        let product_id = positioncheck.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if(positioncheck.classList.contains('plus')){
            type = 'plus';
        }
         changeQuantity(product_id, type);
    }
    
})


const changeQuantity = (product_id, type) => {
    let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);
    if (positionItemInCart >= 0) {
        switch (type) {
            case 'plus':
                carts[positionItemInCart].quantity = carts[positionItemInCart].quantity + 1;
                break;
            case 'minus':
                carts[positionItemInCart].quantity = carts[positionItemInCart].quantity - 1;
                if (carts[positionItemInCart].quantity < 1) {
                    carts.splice(positionItemInCart, 1);
                }
                break;
        
            default:
                
        }
        
    }
    addCartToHTML();
    addCartToMemory();
    
}



const initapp=()=>{
    //get product from json
    fetch('product.json')
    .then(response => response.json())
    .then(data=>{
        listProduct = data;
        addToHTML();


        //get cart from memory
        if(localStorage.getItem('cart')){
            carts = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    })

}
initapp();

