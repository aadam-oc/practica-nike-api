import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.css"],
})
export class FooterComponent {
  footerLinks = [
    {
      title: "TIENDA",
      links: ["Hombre", "Mujer", "Niño/a", "Ofertas", "Colecciones"],
    },
    {
      title: "AYUDA",
      links: ["Estado del pedido", "Envío y entrega", "Devoluciones", "Opciones de pago", "Contactar"],
    },
    {
      title: "ACERCA DE NIKE",
      links: ["Noticias", "Empleo", "Inversores", "Sostenibilidad"],
    },
    {
      title: "REDES SOCIALES",
      links: ["Twitter", "Facebook", "Instagram", "YouTube"],
    },
  ]
}

