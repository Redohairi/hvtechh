// src/app/products/product.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:3000/products';

  // Mock de produtos
  const mockProducts: Product[] = [
    { _id: '1', description: 'desc 1', name: 'Produto 1', price: 10, stock: 10 },
    { _id: '2', description: 'desc 2', name: 'Produto 2', price: 20, stock: 5 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all products', () => {
    service.getProducts().subscribe((products) => {
      expect(products.length).toBe(2);
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should fetch product by ID', () => {
    const mockProduct: Product = {
      _id: '1',
      description: 'descricao mock',
      name: 'Produto 1',
      price: 10,
      stock: 2,
    };

    service.getProductById('1').subscribe((product) => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should create a new product', () => {
    // Inclua description e stock no newProduct
    const newProduct: Product = {
      _id: '3',
      description: 'descricao 3',
      name: 'Produto 3',
      price: 30,
      stock: 50,
    };

    service.createProduct(newProduct).subscribe((product) => {
      expect(product).toEqual(newProduct);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);
    req.flush(newProduct);
  });

  it('should update a product', () => {
    // Aqui também ajustamos para incluir _id, description e stock
    const updatedProduct: Product = {
      _id: '2',
      description: 'descricao atualizada',
      name: 'Produto 2 Atualizado',
      price: 25,
      stock: 999,
    };

    service.updateProduct('2', updatedProduct).subscribe((product) => {
      expect(product).toEqual(updatedProduct);
    });

    const req = httpMock.expectOne(`${apiUrl}/2`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedProduct);
    req.flush(updatedProduct);
  });

  it('should delete a product', () => {
    service.deleteProduct('1').subscribe((res) => {
      expect(res).toBeUndefined();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
