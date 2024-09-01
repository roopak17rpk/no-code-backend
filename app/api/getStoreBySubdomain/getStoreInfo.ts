/**
 * write a simple function returnning json object
 */
export async function getStoreInfo(subdomain: string) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (subdomain) {
        resolve({
          storeId: 1,
          storeName: "Store 1",
          storeOwner: "Owner 1",
        });
      } else {
        reject(new Error("Invalid subdomain"));
      }
    }, 1000);
  });
}
