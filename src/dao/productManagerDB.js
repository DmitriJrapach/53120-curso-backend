import productModel from "./models/productModel.js";

class productManagerDB {

  async getAllProducts(limit, page, query, sort) {
    try {
      // Construye el filtro para la consulta
      let filter = {};

      // Verifica si se proporciona un filtro por categoría
      if (query.category) {
        filter.category = query.category;
      }

      // Verifica si se proporciona un filtro por disponibilidad
      if (query.availability) {
        filter.status = query.availability === 'true'; // Convierte el valor de string a booleano
      }

      // Realiza la consulta paginada con los filtros y el ordenamiento
      const result = await productModel.paginate(filter, { limit: limit, page: page, lean: true, sort: sort });
      return result;
    } catch (error) {
      console.error(error);
      throw new Error('Error al obtener productos');
    }
  }

  async getProductById(pid) {
    const product = await productModel.findOne({_id: pid});

    if (!product) throw new Error(`El producto ${pid} no existe`);

    return product;
    
  }

  async createProduct(product) {
    const { title, description, code, price, stock, category, thumbnails} =
      product;

    if (!title || !description || !code || !price || !stock || !category) {
      throw new Error("Error al crear el producto");
    }
    try {
        const result = await productModel.create({ title, description, code, price, stock, category, thumbnails: thumbnails ?? []});
        return result;
        console.log("producto creado")
    } catch (error) {
        console.error(error)
        throw new Error("Error al crear el producto");
    }
  }
  
  async updateProduct(pid, productUpdate) {
    try{
        const result = await productModel.updateOne({__id: pid}, productUpdate)
        
        return result;
    }catch(error) {
        throw new Error ("Error al actualizar el producto");
    }
  }

  async deleteProduct(pid) {
    try {
        const result = await productModel.deleteOne({__id: pid})
        if (result.deleteCount === 0) throw new Error(`El producto ${pid} no existe!`);

        return result;
    } catch(error) {
        console.error(error.message)
        throw new Error(`Error al eliminar el producto ${pid}`);
    }
  }
}

export { productManagerDB };