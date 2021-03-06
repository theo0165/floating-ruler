const Store = require("electron-store");

const store = new Store({
    defaults: {
        autostart: true,
        theme: "dark"
    }
});

module.exports = {
    setData: (key, value) => {
        store.set(key, value)
    },
    getData: (key) => {
        return store.get(key)
    },
    getAll: () => {
        return store.get()
    }
}