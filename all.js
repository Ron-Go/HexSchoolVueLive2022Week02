import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js";

// 根元件
const app = createApp({
    data() {
        return {
            url: 'https://vue3-course-api.hexschool.io/v2',
            path: 'vue2022ron',
            signinData: {
                username: "",
                password: "",
            },
            signinStatus: 0,
            // signinStatus => 0：無狀態 ; 1:讀取中 ; 2：成功 ; 3：失敗
            tempProduct: {},
        };
    },
    created() {
    
    },
    methods: {
        
        // 登入
        logging(){
            this.signinStatus = 1;
            axios.post(`${this.url}/admin/signin`, this.signinData)
            .then((res) => {
                console.log(res);
                const { token , expired } = res.data;
                // 把token、expired存入cookie
                document.cookie = `myToken = ${token}; expires = ${ new Date(expired) };`;
                // .then取回成功的回傳資訊，signinStatus為登入成功
                this.signinStatus = res.data.success === true ? 2 : 1;
                // signinStatus為成功，跳頁到products.html
                window.location = this.signinStatus === 2 ? 'products.html' : ' ';
            })
            .catch((err) => {
                console.dir(err);
                // signinStatus為登入失敗
                this.signinStatus = err.response.data.success === false ?  3 : 0;
            })
        },
    },
});

app.mount("#app");