import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js";

// 根元件
const app = createApp({
  data() {
    return {
      api: {
        url: 'https://vue3-course-api.hexschool.io/v2',
        path: 'vue2022ron',
      },
      signinData: {
        username: "",
        password: "",
      },
    };
  },
  created() {
    
  },
  methods: {
    // 登入
    logging(){
      this.signinStatus = 1;
      axios.post(`${this.api.url}/admin/signin`, this.signinData)
      .then((res) => {
        console.log(res);
        const { token , expired } = res.data;
        // 把token、expired存入cookie
        document.cookie = `myToken = ${token}; expires = ${ new Date(expired) };`;
        // 跳頁到products.html
        window.location = 'products.html';
      })
      .catch((err) => {
        console.dir(err);
        alert('登 入 失 敗')
      })
    },
  },
});

// 子元件
app.component("products", {
  data() {
    return {
      // 存放商品資料
      tempProducts: [],
    };
  },
  created() {
    // 取得token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)myToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
      );
      axios.defaults.headers.common["Authorization"] = token;
      this.checkLogin();
    },
    methods: {
      // 確認是否登入
      checkLogin() {
        axios
        .post(`${this.api.url}/api/user/check`)
        .then((res) => {
          console.log(res);
          this.getData();
        })
        .catch((err) => {
          console.dir(err);
          window.location = 'login.html';
        });
      },
      // 取得商品資料
      getData() {
        axios
        .get(`${this.api.url}/api/${this.api.path}/admin/products`)
        .then((res) => {
          console.log(res);
          this.tempProducts = res.data.products;
        })
        .catch((err) => {
          console.dir(err);
        });
      },
      // 刪除商品
      // 把商品id（product.id）帶入參數
      deleteItem(id) {
        axios
        .delete(`${this.api.url}/api/${this.api.path}/admin/product/${id}`)
        .then((res) => {
          console.log(res.data.message);
          // 刪除完商品，再取得商品資料一次
          this.getData();
        })
        .catch((err) => {
          console.dir(err);
        });
      },
      // 修改商品
      // 把商品id、要修改的資料 => 代入參數
      modifyItem(id, modifyData) {
        axios
        .put(`${this.api.url}/api/${this.api.path}/admin/product/${id}`, {data: modifyData,})
        .then((res) => {
          console.log(res.data.message);
        })
        .catch((err) => {
          console.dir(err);
        });
      },
      // 改變啟用狀態
      // 參數 => 傳入v-for渲染的item資料
      changeSwitch(product) {
        if (product.is_enabled === 0) {
          product.is_enabled = 1;
        } else {
          product.is_enabled = 0;
        }
        this.modifyItem(product.id, product);
      },
      // 登出
      logOut(){
        axios.post(`${this.api.url}/logout`)
        .then((res) => {
          console.log(res);
          window.location = "login.html";
          alert('已 登 出');
        })
      }
    },
    // 從根元件傳遞到子元件的api資料
    props: ["api"],
    template: `
    <div class="d-flex justify-content-end my-3">
    <button type="button" class="btn btn-danger" @click="logOut">登出</button>
    </div>
    
    <table class="table table-striped">
    <thead>
    <tr>
    <th scope="col">商品名稱</th>
    <th width="120">原價</th>
    <th width="120">售價</th>
    <th width="150">是否啟用</th>
    <th width="120">刪除</th>
    </tr>
    </thead>
    <tbody>
    <template v-for="(product , key) in tempProducts" :key="product.num">
    <tr>
    <td>{{ product.title }}</td>
    <td width="120">{{ product.origin_price }}</td>
    <td width="120">{{ product.price }}</td>
    <td width="150">
    <div class="form-check form-switch">
    <input class="form-check-input" type="checkbox" :checked="product.is_enabled === 0 ? false : true" :id="key" @change="changeSwitch(product)">
    <label class="form-check-label" :for="key">{{product.is_enabled === 0 ? '未啟用' : '啟用'}}</label>
    </div>
    </td>
    <td width="120">
    <button type="button" class="btn btn-outline-danger btn-sm" @click="deleteItem(product.id)">刪除</button>
    </td>
    </tr>
    </template>
    </tbody>
    </table>
    <p>目前有{{ tempProducts.length }}項產品</p>
    `,
  });
  
  app.mount("#app");
