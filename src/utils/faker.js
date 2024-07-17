import { fakerES } from "@faker-js/faker";

export const generateProducts = (q) => {
  let products = [];
  for (let i = 0; i < q; i++) {
    products.push({
      _id: fakerES.database.mongodbObjectId(),
      title: fakerES.commerce.productName(),
      description: fakerES.commerce.productDescription(),
      code: fakerES.number.int(1000),
      price: fakerES.number.int(100),
      status: true,
      stock: fakerES.number.int(100),
      category: fakerES.commerce.productMaterial(),
      thumbnails: [fakerES.image.url()],
      owner: fakerES.database.mongodbObjectId()
    });
  }
  return products;
};

export const generateProduct = () => ({
  title: fakerES.commerce.productName(),
  description: fakerES.commerce.productDescription(),
  code: fakerES.number.int(1000),
  price: fakerES.number.int(100),
  stock: fakerES.number.int(100),
  category: fakerES.commerce.productMaterial(),
  thumbnails: [fakerES.image.url()],
});

export const generateUsers = () => {
  let email = fakerES.internet.email();
  let password = fakerES.internet.password();
  return {
    _id: fakerES.database.mongodbObjectId(),
    first_name: fakerES.person.firstName(),
    last_name: fakerES.person.lastName(),
    email,
    email2: email,
    age: fakerES.number.int(100),
    password,
    password2: password
  };
};
