import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../../data-service.service';
import { ApiService } from '../../api.service';
import { AuthService } from '../../auth.service';

import anime from 'animejs/lib/anime.es.js';

// rxjs
import { catchError, concatMap, tap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

@Component({
  selector: 'app-menu-manage-products',
  templateUrl: './menu-manage-products.component.html',
  styleUrl: './menu-manage-products.component.css'
})
export class MenuManageProductsComponent {
  @ViewChild('inputFile') inputFile: ElementRef | undefined;
  @ViewChild('popUpRemove', { read: ElementRef }) popUpRemove: ElementRef | undefined;
  @ViewChild('manageProducts') manageProducts: ElementRef | undefined;

  constructor(private apiService: ApiService,  private authService: AuthService, private dataService: DataService) { }

  showError403InTableProduct: boolean = true;

  // init
  ngOnInit(): void {
    this.showProductTable();
  }

  // change tabs in manageProducts
  tabElement: number = 0;
  changeTab_manageProducts(numberShow: number): void {
    if (this.tabElement != numberShow) {
      this.tabElement = numberShow;
    }
  };

  // searchProductTable
  searchProductTableInput: string = "";
  correspondingProducts: any = [];
  isSearchProductTable: boolean = false;

  searchProductTable() {
    if (this.searchProductTableInput != "") {
      this.isSearchProductTable = true;
      const produtosArray = Object.values(this.productData);

      this.correspondingProducts = produtosArray
        .map((produto: any, index: number) =>
          produto.product_name.toLowerCase().includes(this.searchProductTableInput.toLowerCase()) ? index : undefined
        )
        .filter(index => index !== undefined);

      const startIndex = (this.currentPage - 1) * this.productsPerPage;
      const endIndex = Math.min(startIndex + this.productsPerPage, this.correspondingProducts.length);

      this.indexAcessProduct = this.correspondingProducts.slice(startIndex, endIndex);
      this.pageMax = Math.ceil(this.correspondingProducts.length / this.productsPerPage);
    } else {
      this.isSearchProductTable = false;
      this.indexAcessProduct = [0, 1, 2, 3];
      this.correspondingProducts = [];
    }
  }

  // return last product add 
  showLastProductAdd: boolean = false;

  // show products in table
  public productData: any = [];
  productDataLength: number = 0;
  currentPage: number = 1;
  productsPerPage: number = 4;
  indexAcessProduct: any;
  pageMax: number = 0;

  showProductTable() {
    const userData = {
      user_id: this.authService.getInfoUser()?.owner_id,
    };

    this.apiService.showProductTable(userData)
      .pipe(
        catchError(error => {
          if (error.status == 401) {
            console.log("produto não encontrado");
          }
          return EMPTY;
          // throw error;
        })
      )
      .subscribe(response => {
        this.showError403InTableProduct = false;
        this.productData = response.products;
        this.productDataLength = this.productData.length;

        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = Math.min(startIndex + this.productsPerPage, this.productData.length);

        this.indexAcessProduct = Array.from({ length: endIndex - startIndex }, (_, index) => startIndex + index);

        this.pageMax = Array.from({ length: Math.ceil(this.productData.length / this.productsPerPage) }, (_, index) => index + 1).length;
      });
  }

  previousPage(isPreviousPage: boolean) {
    if (isPreviousPage) {
      if (this.currentPage > 1) {
        this.currentPage--;
        if (!this.isSearchProductTable) {
          this.showProductTable();
        } else {
          this.searchProductTable();
        }
      }
    }
    else {
      if (this.currentPage < this.pageMax) {
        this.currentPage++;
        if (!this.isSearchProductTable) {
          this.showProductTable();
        } else {
          this.searchProductTable();
        }
      }
    }
  }

  // add products in database
  showLoading_buttonAddProduct: boolean = false;
  showFinish_buttonAddProduct: boolean = false;
  showError_buttonAddProduct: boolean = false;

  fileImageProduct: File | undefined;
  nameProduct: string = "";
  nameImageProduct: string = "";
  imageName: string = "";
  codeProduct: string = "";
  priceProduct: string = "";
  discontProduct: number = 0;
  max_quantity: number = 0;
  min_quantity: number = 0;
  descriptionProduct: string = "";

  addProduct() {
    let imageUploadObservable;

    if (!this.nameProduct || !this.codeProduct || !this.priceProduct || this.max_quantity === 0 || this.min_quantity === 0) {
      this.showError_buttonAddProduct = true;
      setTimeout(() => {
        this.showError_buttonAddProduct = false;
      }, 3000);
    } else {
      this.showLoading_buttonAddProduct = true;

      if (this.fileImageProduct) {
        const formData = new FormData();
        formData.append('image', this.fileImageProduct);
        imageUploadObservable = this.apiService.uploadImageProduct(formData);
      } else {
        imageUploadObservable = of(null);
      }

      imageUploadObservable.pipe(
        tap(response => {
          if (response) {
            this.nameImageProduct = response.uniqueName;
          }
        }),
        concatMap(response => {
          const userData = {
            ownerId: 1,
            nameProduct: this.nameProduct,
            codeProduct: this.codeProduct,
            priceProduct: this.priceProduct,
            discontProduct: this.discontProduct,
            max_quantity: this.max_quantity,
            min_quantity: this.min_quantity,
            descriptionProdcut: this.descriptionProduct,
            nameImageProduct: this.nameImageProduct,
          };
          return of(userData);
        })
      )
        .subscribe(userData => {
          this.apiService.addProduct(userData)
            .subscribe(response => {
              this.showLoading_buttonAddProduct = false;
              this.showFinish_buttonAddProduct = true;

              setTimeout(() => {
                this.showFinish_buttonAddProduct = false;
              }, 3000);

              const dataMessageLog = {
                dataMessage: "Novo produto: " + this.nameProduct,
                pathImageName: this.nameImageProduct,
              };
              this.dataService.messageToLogMessage.emit(dataMessageLog);

              this.showProductTable();
            });
        });
    }


  }

  // popup remove
  showPopUpRemove: boolean = false;
  isAnimationPopUpRemove: boolean = false;

  showPopUps(jsonActionWithIndex: any) {
    if (!jsonActionWithIndex.action) {
      this.showPopUpRemove = true;

      // send data Product To PopUpDelete
      this.dataService.dataProductToPopUpDelete.emit(this.productData[jsonActionWithIndex.indexProduct]);

      if (!this.isAnimationPopUpRemove) {
        this.isAnimationPopUpRemove = true;

        anime({
          targets: this.manageProducts?.nativeElement,
          opacity: 0.2,
          filter: 'blur(2px)',
          duration: 300,
          easing: 'easeInOutQuad',
          autoplay: true,
        });

        anime({
          targets: this.popUpRemove?.nativeElement,
          opacity: 1,
          duration: 400,
          easing: 'easeInOutQuad',
          autoplay: true,
          complete: () => {
            this.isAnimationPopUpRemove = false;
          },
        });
      }
    }
  }

  closePopUp(isUpdateTable: boolean) {
    if (!this.isAnimationPopUpRemove) {
      this.isAnimationPopUpRemove = true;

      anime({
        targets: this.manageProducts?.nativeElement,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 400,
        easing: 'easeInOutQuad',
        autoplay: true,
      });

      anime({
        targets: this.popUpRemove?.nativeElement,
        opacity: 0,
        duration: 300,
        easing: 'easeInOutQuad',
        autoplay: true,
        complete: () => {
          this.showPopUpRemove = false;
          this.isAnimationPopUpRemove = false;
          if (isUpdateTable) {
            this.showProductTable();
          }
        },
      });
    }
  }

  // show imageSelectProduct
  imageSelectProduct: string = "";

  openBoxInputSelectImageProduct() {
    this.inputFile?.nativeElement.click();
  }

  selectImageSelectProduct(event: any) {
    this.fileImageProduct = event.target.files[0];
    if (this.fileImageProduct) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSelectProduct = reader.result as string;
      };
      reader.readAsDataURL(this.fileImageProduct);
    }
  }
}
