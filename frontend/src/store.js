import axios from "axios";
import create from "zustand";
// User
const useUser = create((set) => ({
  user: null,
  setUser: (user) => set((state) => ({ user })),
}));
// Products
const useProducts = create((set) => ({
  products: [],
  fetchProducts: () =>
    set(async () => {
      try {
        const { data } = await axios.get("products/all");
         return {
           products:data
         }
      } catch (error) {
       
        return {
          products:[]
        }
      }
    }),
  setProducts: (products) => set(() => ({ products })),
  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),
}));

// Quotes
const useQuotes = create((set) => ({
  quotes: [],
  setQuotes: (quotes) => set({ quotes }),
}));
// Cart Items
const useItemsList = create((set) => ({
  itemsList:  [],
  setitemsList: (itemsList) => set(() => ({ itemsList })),
  addItem: (item) =>
    set((state) => {
      const data = [...state.itemsList, item];
      // localStorage.setItem("itemsList", JSON.stringify(data))
      console.log({ data });
      return { itemsList: data };
    }),
  removeItem: (id) =>
    set((state) => {
      // localStorage.removeItem("itemsList");
      const data = state.itemsList.filter(
        (item) => item.id !== id
      );
      // localStorage.setItem("itemsList", JSON.stringify(data));
      return { itemsList: data };
    }),
  updateItem: (id, startDate, endDate, units) =>
    set((state) => {
      const oldData = state.itemsList;
      const item = oldData.find((item) => item.id === id);
      var index = oldData.indexOf(item);
      console.log({ index });
      item.startDate = startDate;
      item.endDate = endDate;
      item.units = units;

      // localStorage.removeItem("itemsList");
      if (~index) {
        oldData[index] = item;
      }
      const data = oldData;
      console.table(data);
      // localStorage.setItem("itemsList", JSON.stringify(data));
      return { itemsList: data };
    }),
  emptyItemsList: () => set({ itemsList: [] }),
}));

export { useUser, useProducts, useItemsList, useQuotes };
