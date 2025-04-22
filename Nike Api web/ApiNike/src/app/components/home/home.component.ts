import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent {
  currentSlide = 0
  slides = [
    {
      title: "AIR MAX DN8",
      subtitle: "Dynamic Air en todo el pie. Descubre la sensación.",
      buttonText: "Comprar las Dn8",
      buttonLink: "/products",
      leftImage: "/assets/images/carr1.jpg",
      rightImage: "http://172.17.131.11:3000/uploads/1743692183929.jpg",
    },
    {
      title: "NIKE PEGASUS 41",
      subtitle: "Comodidad y rendimiento para tus carreras diarias.",
      buttonText: "Comprar ahora",
      buttonLink: "/products",
      leftImage: "/assets/images/carr1.jpg",
      rightImage: "http://172.17.131.11:3000/uploads/1743692231587.avif",
    },
    {
      title: "COLECCIÓN TECH FLEECE",
      subtitle: "Calidez ligera para el día a día.",
      buttonText: "Descubrir",
      buttonLink: "/products",
      leftImage: "/assets/images/carr1.jpg",
      rightImage: "http://172.17.131.11:3000/uploads/1743692274246.jpeg",
    },
  ]

  featuredProducts = [
    {
      id: 1,
      name: "Nike Sportswear Tech Fleece",
      category: "Sudadera con capucha",
      price: "109,99 €",
      image: "http://172.17.131.11:3000/uploads/1743692311412.webp",
    },
    {
      id: 2,
      name: "Nike Air Force 1 '07",
      category: "Zapatillas",
      price: "119,99 €",
      image: "http://172.17.131.11:3000/uploads/1743692333064.webp",
    },
    {
      id: 3,
      name: "Nike Dri-FIT Academy",
      category: "Chándal de fútbol",
      price: "89,99 €",
      image: "http://172.17.131.11:3000/uploads/1743692350945.webp",
    },
  ]

  prevSlide() {
    this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length
  }

  pauseSlide() {
    // Implementar pausa del carrusel
    console.log("Pausa del carrusel")
  }

  setSlide(index: number) {
    this.currentSlide = index
  }
}

