document.addEventListener("alpine:init", () => {

    Alpine.data('pizzaCart', () => {
        return {
            title: 'King Josh Pizza Cart API',
            pizzas: [],
            username: 'King-Josh01',
            cartId: 're5lt7SOal',
            cartPizzas: [],
            cartTotal: 0.00,
            paymentAmount: 0.00,
            message: '',

            createCart() {
                if (!this.username) {
                    this.cartId = "No username"
                    return;
                }

                const cartId = localStorage["cartId"];
                if (cartId) {
                    this.cartId = cartId
                }
                else {
                    const createCartURL = `https://pizza-api.projectcodex.net/api/pizza-cart/create?username=${this.username}`
                    return axios.get(createCartURL).then(ressult => {
                        this.cartId = result.data.cart_code;
                    })
                }

            },

            getCart() {
                const getCartURL = `https://pizza-api.projectcodex.net/api/pizza-cart/${this.cartId}/get`
                return axios.get(getCartURL);
            },

            addPizza(pizzaId) {
                return axios.post(`https://pizza-api.projectcodex.net/api/pizza-cart/add`, {
                    "cart_code": this.cartId,
                    "pizza_id": pizzaId
                })
            },

            removePizza(pizzaId) {
                return axios.post(`https://pizza-api.projectcodex.net/api/pizza-cart/remove`, {
                    "cart_code": this.cartId,
                    "pizza_id": pizzaId
                })
            },

            pizzaPicture(pizza) {
                return `/pictures/${pizza.size}.png`
            },

            pay(amount) {
                return axios.post(`https://pizza-api.projectcodex.net/api/pizza-cart/pay`, {
                    "cart_code": this.cartId,
                    amount
                });
            },

            showCartData() {
                this.getCart().then(result => {
                    const cartData = result.data;
                    this.cartPizzas = cartData.pizzas;
                    this.cartTotal = cartData.total.tofixed(2);
                });
            },

            addPizzaToCart(pizzaId) {
                this.addPizza(pizzaId)
                .then(this.showCartData())
            },

            removePizzaFromCart(pizzaId) {
                this.removePizza(pizzaId)
                .then(this.showCartData())
            },

            payForCart(amount) {
                this.pay(this.paymentAmount)
                .then(result => {
                    if (result.data.status == 'failure'){
                        this.message = result.data.message;
                    }
                    else {
                        this.message = 'Payment received'
                    }
                })
            },

            init() {
                const storage = localStorage['username'];
                if (storage) {
                    
                }
                axios
                    .get('https://pizza-api.projectcodex.net/api/pizzas')
                    .then(result => {
                        console.log(result.data);
                        this.pizzas = result.data.pizzas
                    });

                this.getCart().then(result => {
                    const cartData = result.data
                    this.cartPizzas = cartData.pizzas;
                    this.cartTotal = cartData.total;
                })

            }
        }
    });
});