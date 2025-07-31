const welcomel = document.getElementById('welcome');
const logoutBtn = document.getElementById('logoutBtn');

let currentUser = localStorage.getItem("user");
if (currentUser && welcomel) {
    let parsedUser = JSON.parse(currentUser);
    welcomel.innerHTML = `Hello ${parsedUser.name}`;
    if (logoutBtn) logoutBtn.classList.remove('hidden');
} else if (welcomel) {
    welcomel.innerHTML = `Hello Please <a href='login.html'>login</a>`;
}


if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
        localStorage.removeItem("user");
        window.location.href = "index.html";
    });
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        let users = JSON.parse(localStorage.getItem("users")) || {};
        let user = users[email];

        if (user) {
            if (user.password === password) {
                localStorage.setItem("user", JSON.stringify(user));
                window.location.href = "index.html";
            } else {
                alert("Password is Incorrect");
            }
        } else {
            alert("Email not found");
        }
    });
}
const validateEmail = (email) =>{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert("The Passwords do not match");
            return;
        }
        
        else if (!validateEmail(email)) {
            alert("Invalid email address. try again!");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || {};
        if (users[email]) {
            alert("This Email already exists");
            return;
        }

        const user = { name, email, password };
        users[email] = user;
        localStorage.setItem("users", JSON.stringify(users));

        alert("Registering is successful. Please Login!");
        window.location.href = "login.html";
    });
}



const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(event){
        event.preventDefault();
        const email = document.getElementById('contactEmail').value;
        const message = document.getElementById('contactMessage').value;
        if (!validateEmail(email)) {
            alert("Invalid email address. try again!");
            return;
        }
        let loginUser = JSON.parse(localStorage.getItem("user"));
        if(loginUser){
            alert(`${loginUser.name}'s Message has been sent`);
        } else {
            alert("Your Message has been sent");
        }
        contactForm.reset();

    });
}


document.addEventListener('DOMContentLoaded', function() {
    const productsContainer = document.querySelector(".products");
    let productsData = [];
    if(productsContainer)  {
        fetch('products.json')
            .then(response => response.json())
            .then(data => {
                productsData = data;
                data.forEach(product => {
                    const newCard = document.createElement('div');
                    newCard.className = 'product-card';
                    newCard.innerHTML = `
                        <h2 class="product-title">${product.title}</h2>
                                <img src="${product.image}" alt="${product.title}"/>
                                <div class="product-buy">
                                    <p class="product-price">${product.price}$</p>
                                    <p class="product-number">Stock:${product.count}</p>
                                    <button class="buy" data-id="${product.id}" type="button">Add To Cart</button>
                                </div>`;
                    productsContainer.appendChild(newCard);        
                });    
                setupBuyProduct();
                renderCart();

            })
            .catch(error => {
                console.error('Error fetching or parsing JSON:', error);
            });
    }

    function setupBuyProduct() {
        const buyButtons = document.querySelectorAll(".buy");
        buyButtons.forEach(button=>{
            button.addEventListener('click', function(){
                const productId = parseInt(button.dataset.id);
                let cart = JSON.parse(localStorage.getItem("cart")) || [];
                const product = productsData.find(p=> p.id === productId);
                const existItem = cart.find(item => item.id ===productId);
                if(existItem) {
                    if(existItem.count < 10){
                        existItem.count++;
                    } else {
                        alert("out of stock");
                        return;
                    }
                    
                } else {
                    cart.push({...product, count : 1})
                }
                localStorage.setItem("cart", JSON.stringify(cart));
                renderCart();
            });    
        });
    }

    function renderCart() {
        const sidebar = document.querySelector(".sidebar");
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        if (cart.length === 0) {
            sidebar.innerHTML = "Your Shopping List is empty";
            return;
        }
        sidebar.innerHTML = ""
        cart.forEach(item => {
            const newCart = document.createElement('div');
            newCart.className = "cart"
            newCart.innerHTML = `
            <h2 class="cart-title">${item.title}</h2>
                    <div class="cart-data-price">
                        <p class="cart-price">${item.price}$</p>
                        <div class="cart-data-count">  
                            <button class="cart-increase" data-id="${item.id}">+</button>
                            <span>count: ${item.count}</span>
                            <button class="cart-decrease" data-id="${item.id}">-</button>
                        </div>
                    </div>`;
            
            sidebar.appendChild(newCart);
            
        });
        const totalPrice = document.createElement('div');
        totalPrice.className = "cart-total";
        totalPrice.innerHTML= `
        <button class="total-price" id="total-price">Total Price</button>`;
        sidebar.appendChild(totalPrice);
        increaseCount();
        decreaseCount();
        setupTotalButton();
    }

    function increaseCount() {
        const increaseButtons = document.querySelectorAll('.cart-increase');
        increaseButtons.forEach(button=>{
            button.addEventListener('click', function(){
                const productId = parseInt(button.dataset.id);
                let cart = JSON.parse(localStorage.getItem("cart")) || [];
                const product = cart.find(p=> p.id === productId);
                if(product) {
                    if(product.count < 10){
                        product.count++;
                    } else {
                        alert("out of stock");
                        return;
                    }
                }
                localStorage.setItem("cart", JSON.stringify(cart));
                renderCart();
            });
        });
    }
    function decreaseCount() {
        const decreaseButtons = document.querySelectorAll('.cart-decrease');
        decreaseButtons.forEach(button=>{
            button.addEventListener('click', function(){
                const productId = parseInt(button.dataset.id);
                let cart = JSON.parse(localStorage.getItem("cart")) || [];
                const productIndex = cart.findIndex(p=> p.id === productId);
                if(productIndex > -1) {
                    if (cart[productIndex].count >1 ){
                        cart[productIndex].count--;
                    } else {
                        cart.splice(productIndex, 1);
                    }        
                }
                localStorage.setItem("cart", JSON.stringify(cart));
                renderCart();
            });
        });
    }
    function setupTotalButton() {
        const totalButton = document.getElementById("total-price");
        totalButton.addEventListener('click', function(){
            const currentUser = JSON.parse(localStorage.getItem("user"));
            if (!currentUser) {
                alert("Please First Login Into Your Account!");
                return
            }
            let cart = JSON.parse(localStorage.getItem("cart"));
            let total = cart.reduce((sum,item)=> sum+(item.price*item.count),0);
            alert(`${currentUser.name}, Your Total Price is ${total}`);
        });
    }
});



         



  

