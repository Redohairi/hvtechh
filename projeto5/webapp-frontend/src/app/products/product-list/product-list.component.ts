import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',  // Usando template externo
  imports: [CommonModule, FormsModule, RouterLink]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  filterText = '';

  // Propriedades para paginação:
  currentPage: number = 1;
  itemsPerPage: number = 5; // Ajuste conforme necessário

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.currentPage = 1; // Reseta para a primeira página
      },
      error: (err) => {
        console.error('Erro ao listar produtos', err);
      }
    });
  }

  applyFilter() {
    this.filteredProducts = this.products.filter(p => 
      p.name.toLowerCase().includes(this.filterText.toLowerCase()) ||
      p.description.toLowerCase().includes(this.filterText.toLowerCase())
    );
    this.currentPage = 1; // Reseta para a primeira página ao filtrar
  }

  onDelete(id: string) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts(); // Recarrega a lista
        },
        error: (err) => {
          console.error('Erro ao excluir produto', err);
        }
      });
    }
  }

  // Retorna somente os produtos da página atual
  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Calcula o total de páginas
  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
}
