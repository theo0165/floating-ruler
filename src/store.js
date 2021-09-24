const Store = require("electron-store");

const store = new Store();

module.exports = {
    setData: (key, value) => {
        console.log("Saving setting");
        store.set(key, value)
    },
    getData: (key) => {
        console.log("Reteriving setting")
        return store.get(key)
    }
}