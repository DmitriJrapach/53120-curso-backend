import { fakerES_MX } from '@faker-js/faker';

export const generateProducts =() => {
  return {
    id: fakerES_MX.string.uuid(),
    title: fakerES_MX.commerce.productName(),
    description: fakerES_MX.commerce.productDescription(),
    code: fakerES_MX.string.alphanumeric(6),
    price: fakerES_MX.commerce.price(),
    status: fakerES_MX.datatype.boolean(0.5),
    stock: fakerES_MX.number.int(100),
    category: fakerES_MX.commerce.productAdjective(),
    thumbnail: fakerES_MX.image.url({height: 100, width: 100})
  };
}