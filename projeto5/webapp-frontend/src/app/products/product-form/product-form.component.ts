import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-product-form',
  template: `
    <h2>{{ isEdit ? 'Editar Produto' : 'Novo Produto' }}</h2>
    <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
      <label for="name">Nome</label>
      <input id="name" formControlName="name" type="text" />

      <label for="description">Descrição</label>
      <input id="description" formControlName="description" type="text" />

      <label for="price">Preço</label>
      <input id="price" formControlName="price" type="number" />

      <label for="stock">Estoque</label>
      <input id="stock" formControlName="stock" type="number" />

      <button type="submit">{{ isEdit ? 'Atualizar' : 'Criar' }}</button>
    </form>
  `
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  isEdit = false;
  productId: string | null = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Criar o form
    this.productForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      price: new FormControl(0, [Validators.required, Validators.min(0)]),
      stock: new FormControl(0, [Validators.required, Validators.min(0)])
    });

    // Verificar se está editando (rota: /products/edit/:id)
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
      if (this.productId) {
        this.isEdit = true;
        this.loadProduct(this.productId);
      }
    });
  }

  loadProduct(id: string) {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock
        });
      },
      error: (err) => {
        console.error('Erro ao carregar produto', err);
      }
    });
  }

  onSubmit() {
    if (this.productForm.invalid) {
      return;
    }

    const productData: Product = this.productForm.value;

    if (this.isEdit && this.productId) {
      this.productService.updateProduct(this.productId, productData).subscribe({
        next: () => {
          alert('Produto atualizado com sucesso!');
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error('Erro ao atualizar produto', err);
        }
      });
    } else {
      this.productService.createProduct(productData).subscribe({
        next: () => {
          alert('Produto criado com sucesso!');
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error('Erro ao criar produto', err);
        }
      });
    }
  }
}
