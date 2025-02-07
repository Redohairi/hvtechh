import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html', // Aponta para o arquivo externo de HTML
  styleUrls: ['./product-form.component.css'],  // Caso tenha um arquivo de CSS
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  isEdit = false;
  productId: string | null = null;
  selectedFile: File | null = null;
  previewImage: string | null = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      price: new FormControl(0, [Validators.required, Validators.min(0)]),
      stock: new FormControl(0, [Validators.required, Validators.min(0)]),
    });

    // Verifica se está em modo de edição (rota: /products/edit/:id)
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
        this.previewImage = product.imageUrl || null;
      },
      error: (err) => console.error('Erro ao carregar produto', err)
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Gerar pré-visualização da imagem
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    const productData: Product = this.productForm.value;

    if (this.isEdit && this.productId) {
      // Atualiza o produto
      this.productService.updateProduct(this.productId, productData).subscribe({
        next: () => {
        
          if (this.selectedFile) {
            this.productService.uploadImage(this.productId!, this.selectedFile).subscribe({
              next: () => {
                alert('Produto atualizado com imagem!');
                this.router.navigate(['/products']);
              },
              error: (err) => {
                console.error('Erro ao enviar imagem', err);
                alert('Produto atualizado, mas houve erro no upload da imagem.');
                this.router.navigate(['/products']);
              }
            });
          } else {
            alert('Produto atualizado com sucesso!');
            this.router.navigate(['/products']);
          }
        },
        error: (err) => console.error('Erro ao atualizar produto', err)
      });
    } else {
      // Cria o produto primeiro
      this.productService.createProduct(productData).subscribe({
        next: (createdProduct) => {
          // Se houver imagem para upload, faz o upload com o ID retornado
          if (this.selectedFile && createdProduct._id) {
            this.productService.uploadImage(createdProduct._id, this.selectedFile).subscribe({
              next: () => {
                alert('Produto criado com imagem!');
                this.router.navigate(['/products']);
              },
              error: (err) => {
                console.error('Erro ao enviar imagem', err);
                alert('Produto criado, mas houve erro no upload da imagem.');
                this.router.navigate(['/products']);
              }
            });
          } else {
            alert('Produto criado com sucesso!');
            this.router.navigate(['/products']);
          }
        },
        error: (err) => console.error('Erro ao criar produto', err)
      });
    }
  }
}
