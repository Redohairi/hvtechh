export interface Product {
    _id?: string;         // ID vindo do Mongo
    name: string;
    description: string;
    price: number;
    stock: number;
    // se tiver imagem, roles, etc., pode adicionar aqui
  }
  